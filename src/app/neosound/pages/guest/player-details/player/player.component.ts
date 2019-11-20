import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  EventEmitter
} from "@angular/core";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "./region-plugin";
import { PlayerService } from "../../../../services/player.service";
import { LanguageService } from "../../../../services/language.service";
import { DataService } from "../../../../shared";
import { FileResultService } from "../services/file-result.service";
import { FilePeeksService } from "../services/file-peeks.service";
import { FileInfoService } from "../services/file-info.service";

import CanvasDrawer from "./canvas-drawer";

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

@Component({
  selector: "ngx-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnDestroy, OnInit {
  public wavesurfer: any;
  public waveFormData: any;
  public peekCache: any;
  public isLoadingInfo: boolean = true;
  public isLoadingPeeks: boolean = true;
  public isLoading: boolean = true;
  private fileUrl: string;
  public waveFormInitted: boolean = false;
  @Input() fileName: string;
  @Input() batchId: string;
  public regions = [];
  private color;
  private shouldInit = false;
  playing: boolean = false;
  id: string;
  constructor(
    private filePeeksService: FilePeeksService,
    private playerService: PlayerService,
    private dataService: DataService,
    private fileResultService: FileResultService,
    private fileInfoService: FileInfoService
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

  ngOnInit() {
    this.id = null;
    this.fetchFile();
  }

  fetchFile() {
    this.id = makeid(10);
    this.filePeeksService.peeks.subscribe(data => {
      if (data && data.length) {
        this.peekCache = data;
        this.isLoadingPeeks = false;
        this.tryInit();
      }
    });
    this.fileInfoService.fileInfo.subscribe(data => {
      if (data && data.url && data.url.length) {
        this.fileUrl = data.url;
        this.isLoadingInfo = false;
        this.tryInit();
      }
    });
  }
  t(v) {
    return LanguageService.t(v);
  }

  tryInit() {
    if (this.isLoadingInfo === false && this.isLoadingPeeks === false) {
      this.init(this.fileUrl, this.peekCache);
    }
  }

  init(fileUrl, peaks) {
    this.wavesurfer = WaveSurfer.create({
      container: "#" + this.id,
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
      this.waveFormInitted = true;
      this.fileResultService.fileResult.subscribe(data => {
        if (data.regions) {
          this.setRegions(data.regions);
        }
      });
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
    this.wavesurfer && this.wavesurfer.clearRegions();
    this.wavesurfer && this.wavesurfer.destroy();
  }
}
