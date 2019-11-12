import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from "@angular/core";
import { FilesService } from "../../../../services/files.service";
import { FilterService } from "../../../../services/filter.service";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "./region-plugin";
import { PlayerService } from "../../../../services/player.service";
import { LanguageService } from "../../../../services/language.service";
import { DataService } from "../../../../shared";
import { FileResultService } from "../services/file-result.service";

import CanvasDrawer from "./canvas-drawer";

@Component({
  selector: "ngx-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnDestroy, OnChanges {
  public wavesurfer: any;
  public waveFormData: any;
  public peekCache: any;
  public isLoading: boolean = false;
  private fileUrl: string;

  @Input() fileName: string;
  @Input() batchId: string;
  public regions = [];
  private color;
  playing: boolean = false;

  constructor(
    private filesService: FilesService,
    private filterService: FilterService,
    private playerService: PlayerService,
    private dataService: DataService,
    private fileResultService: FileResultService
  ) {
    if (
      dataService.config["colors"] &&
      dataService.config["colors"].secondary
    ) {
      this.color = dataService.config["colors"].secondary;
    } else {
      this.color = "#0098d9";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fetchFile();
  }

  fetchFile() {
    this.isLoading = true;
    this.filesService
      .getFile({ batchid: this.batchId, filename: this.fileName })
      .subscribe(data => {
        if (data) {
          this.fileUrl = data.url;
          this.filesService
            .getAudioWaveForm({
              filename: this.fileName,
              batchid: this.batchId
            })
            .subscribe(meta => {
              if (meta.ContentRange) {
                this.loadChunks(meta);
              } else {
                this.init(this.fileUrl, this.getPeaks(meta));
              }
            });
        }
      });
  }
  t(v) {
    return LanguageService.t(v);
  }

  loadChunks(meta) {
    this.filesService
      .getAudioWaveForm({
        filename: this.fileName,
        batchid: this.batchId,
        ContentRange: meta.ContentRange
      })
      .subscribe(res => {
        meta.data = meta.data + res.data;
        meta.ContentRange = res.ContentRange;
        if (meta.ContentRange) {
          this.loadChunks(meta);
        } else {
          this.init(this.fileUrl, this.getPeaks(meta));
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

  init(fileUrl, peaks) {
    if(this.wavesurfer) {
      this.wavesurfer.destroy();
    }
    this.wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: this.color,
      progressColor: "#a4abb3",
      normalize: true,
      renderer: CanvasDrawer,
      height: peaks[0] instanceof Array ? 30 : 60,
      splitChannels: true,
      backend: "MediaElement",
      plugins: [
        TimelinePlugin.create({
          container: "#timelineContainer"
        }),
        RegionsPlugin.create({})
      ]
    });
    this.wavesurfer.load(fileUrl, peaks, "auto");
    this.wavesurfer.on("ready", () => {
      this.isLoading = false;
      this.fileResultService.fileResult.subscribe(data => {
        this.removeRegions();
        if(data.regions) {
          this.setRegions(data.regions);
        }
      });
      this.fileResultService.getResult(this.batchId, this.fileName);
    });
    this.wavesurfer.on("audioprocess", time => {
      this.playerService.setActive(time);
    });
    this.wavesurfer.on("seek", time => {
      this.playerService.setActive(time * this.wavesurfer.getDuration());
    });
  }
  play() {
    this.playing = !this.playing;
    this.wavesurfer && this.wavesurfer.playPause();
  }
  seekTo(ms) {
    this.wavesurfer.seekTo(ms / this.wavesurfer.getDuration());
  }
  setRegions(regions) {
    regions.map(region => {
      this.wavesurfer.addRegion(region);
    });
  }
  removeRegions() {
    this.wavesurfer && this.wavesurfer.clearRegions();
  }
  ngOnDestroy() {
    this.wavesurfer && this.wavesurfer.destroy();
  }
}
