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

import CanvasDrawer from "./canvas-drawer";

@Component({
  selector: "ngx-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnDestroy, OnChanges {
  public wavesurfer: any;
  public waveFormData: any;
  public peekCache: any;
  public isLoading: boolean = false;

  @Input() fileName: string;
  @Input() batchId: string;
  @Input() fileUrl: string;
  @Output() ready: EventEmitter<any> = new EventEmitter<any>();
  public regions = [];

  constructor(
    public filesService: FilesService,
    public filterService: FilterService,
    public playerService: PlayerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.fetchFile();
  }
  fetchFile() {
    this.isLoading = true;
    this.filesService
      .getAudioWaveForm({ filename: this.fileName, batchid: this.batchId })
      .subscribe(meta => {
        if (meta.ContentRange) {
          this.loadChunks(meta);
        } else {
          this.init(this.fileUrl, this.getPeaks(meta));
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
    this.wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#0098d9",
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
      this.ready.emit();
    });
    this.wavesurfer.on("audioprocess", time => {
      this.playerService.setActive(time);
    });
    this.wavesurfer.on("seek", time => {
      this.playerService.setActive(time * this.wavesurfer.getDuration());
    });
  }
  play() {
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
  ngOnDestroy() {
    this.wavesurfer && this.wavesurfer.destroy();
  }
}
