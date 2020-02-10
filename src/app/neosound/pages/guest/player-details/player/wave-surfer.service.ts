import { Injectable } from "@angular/core";
import { DataService } from "../../../../shared";
import { FileResultService } from "../services/file-result.service";
import { FilePeeksService } from "../services/file-peeks.service";
import { FileInfoService } from "../services/file-info.service";
import { PlayerService } from "../../../../services/player.service";
import { FilesService } from "../../../../services/files.service";

import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "./region-plugin";
import CanvasDrawer from "./canvas-drawer";

@Injectable()
export class WaveSurferService {
  private color: string = "#0098d9";
  public loading: boolean = true;
  private currentFile: { batchId: string; fileName: string; url: string };
  private nextFile: { batchId: string; fileName: string; url: string };
  private instances: any[] = [];
  private currentPlayer;
  constructor(
    private dataService: DataService,
    private playerService: PlayerService,
    private filesService: FilesService
  ) {
    if (
      dataService.config["colors"] &&
      dataService.config["colors"].secondary
    ) {
      this.color = dataService.config["colors"].secondary;
    }
  }

  init(elementId: string, batchId: string, fileName: string) {
    this.loading = true;
    this.filesService
      .getFile({
        batchid: batchId,
        filename: fileName
      })
      .subscribe(data => {
        if (data) {
          this.currentFile = { url: data.url, batchId, fileName };
          if (this.currentFile) {
            this.destroy(this.currentFile);
          } else {
            this.load(this.nextFile);
          }
        }
      });
  }

  initWaveSurfer(file, data) {
    if (
      this.currentFile.batchId === file.batchId &&
      this.currentFile.fileName === file.fileName
    ) {
      const wavesurfer = WaveSurfer.create({
        container: "#player",
        waveColor: this.color,
        progressColor: "#a4abb3",
        normalize: true,
        renderer: CanvasDrawer,
        height: data[0] instanceof Array ? 30 : 60,
        splitChannels: true,
        backend: "MediaElement",
        plugins: [
          TimelinePlugin.create({
            container: "#timelineContainer"
          }),
          RegionsPlugin.create({})
        ]
      });
      wavesurfer.load(file.url, data, "auto");
      wavesurfer.on("audioprocess", time => {
        this.playerService.setActive(time);
      });
      wavesurfer.on("seek", time => {
        this.playerService.setActive(time * wavesurfer.getDuration());
      });
      wavesurfer.on("ready", time => {
        console.log("ready");
        this.loading = false;
        this.loadRegions(wavesurfer, file);
      });
      wavesurfer.on("destroy", time => {
        console.log("destroy");
      });
      this.instances.push(wavesurfer);
      this.currentPlayer = wavesurfer;
    }
  }

  destroy(file: any) {
    while (this.instances.length) {
      const instance = this.instances.pop();
      instance.cancelAjax();
      instance.destroy();
    }
    this.load(file);
  }

  destroyAll() {
    while (this.instances.length) {
      const instance = this.instances.pop();
      instance.cancelAjax();
      instance.destroy();
    }
  }

  load(file: any) {
    this.loadPeeks(file);
  }

  loadPeeks(file) {
    this.filesService
      .getAudioWaveForm({
        filename: file.fileName,
        batchid: file.batchId
      })
      .subscribe(meta => {
        if (meta.ContentRange) {
          this.loadChunks(file.batchId, file.fileName, meta);
        } else {
          this.initWaveSurfer(file, this.getPeaks(meta));
        }
      });
  }
  loadChunks(batchId, fileName, meta) {
    this.filesService
      .getAudioWaveForm({
        filename: fileName,
        batchid: batchId,
        ContentRange: meta.ContentRange
      })
      .subscribe(res => {
        meta.data = meta.data + res.data;
        meta.ContentRange = res.ContentRange;
        if (meta.ContentRange) {
          this.loadChunks(batchId, fileName, meta);
        }
      });
  }
  getPeaks(meta) {
    const data = JSON.parse(meta.data);
    let peaks = [];
    if (data.data[0] instanceof Array || data.channels === 1) {
      peaks = data.data;
    } else {
      peaks = [[], []];
      const datalen = data.data.length;
      for (let i = 0; i < datalen / 2; i++) {
        if (i % 2) {
          peaks[1].push(data.data[2 * i]);
          peaks[1].push(data.data[2 * i + 1]);
        } else {
          peaks[0].push(data.data[2 * i]);
          peaks[0].push(data.data[2 * i + 1]);
        }
      }
    }
    return peaks;
  }

  loadRegions(instance: any, file: any) {
    this.filesService
      .getRegions({
        batchid: file.batchId,
        filename: file.fileName,
        intervals: "anger"
      })
      .subscribe(data => {
        if (data && data.result && data.result.anger) {
          if (
            this.currentFile.batchId === file.batchId &&
            this.currentFile.fileName === file.fileName
          ) {
            const regions = [];
            const buff = [
              ...data.result.anger.ints,
              ...data.result.anger.music
            ];
            buff.forEach(element => {
              instance.addRegion({
                start: element[0],
                end: element[1],
                color: this.getColor(element[3], element[2], !element[2])
              });
            });
          }
        }
      });
  }

  getColor(val: any, type?: string, isMusic = false) {
    if (isMusic) {
      return "rgba(0,255,0, 1)";
    }

    const x = val / 2 + 50;
    return (
      "rgba(255, " + (255 - (x - 50) * 5) + ", " + (255 - (x - 50) * 5) + ", 1)"
    );
  }

  togglePlay() {
    this.currentPlayer && this.currentPlayer.playPause();
  }

  seekTo(ms: any) {
    this.currentPlayer.seekTo(ms / this.currentPlayer.getDuration());
  }
}
