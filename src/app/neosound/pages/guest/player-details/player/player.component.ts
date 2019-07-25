import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FilesService } from "../../../../services/files.service";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import { PlayerService } from "../../../../services/player.service";
import { LanguageService } from "../../../../services/language.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";

import CanvasDrawer from "./canvas-drawer";

@Component({
  selector: "ngx-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit, OnDestroy {
  public wavesurfer: any;
  public fileUrl: string;
  public waveFormData: any;
  public peekCache: any;
  @Input() fileName: string;
  @Input() batchId: string;
  public isLoading = true;
  public regions = [];

  constructor(
    private filesService: FilesService,
    private playerService: PlayerService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.filesService
      .getFile({ filename: this.fileName, batchid: this.batchId })
      .subscribe(res => {
        this.fileUrl = res.url;
        this.filesService
          .getAudioWaveForm({ filename: this.fileName, batchid: this.batchId })
          .subscribe(meta => {
            if (meta.data) {
              this.wavesurfer = WaveSurfer.create({
                container: "#waveform",
                progressColor: "#3399CC",
                waveColor: "#1CACE3",
                normalize: true,
                //renderer: CanvasDrawer,
                //barWidth: 3,
                height: 60,
                splitChannels: true,
                backend: "MediaElement",
                plugins: [
                  TimelinePlugin.create({
                    container: "#timelineContainer"
                  }),
                  RegionsPlugin.create({})
                ]
              });
              this.wavesurfer.load(this.fileUrl, meta.data.data, "auto");
              this.wavesurfer.on("ready", () => {
                this.isLoading = false;
                this.regions.map(region => {
                  this.wavesurfer.addRegion(region);
                });
              });
              this.wavesurfer.on("audioprocess", time => {
                this.playerService.setActive(time);
              });
            }
          });
      });
  }
  t(v) {
    return LanguageService.t(v);
  }
  play() {
    this.wavesurfer && this.wavesurfer.playPause();
  }
  seekTo(ms) {
    this.wavesurfer.seekTo(ms / this.wavesurfer.getDuration());
  }
  setRegions(regions) {
    this.regions = regions;
    if (this.wavesurfer) {
      this.wavesurfer.clearRegions();
      this.regions.map(region => {
        this.wavesurfer.addRegion({ ...region, drag: false });
      });
      //this.wavesurfer.enableDragSelection(false)
    }
  }
  ngOnDestroy() {
    this.wavesurfer && this.wavesurfer.destroy();
  }
}
