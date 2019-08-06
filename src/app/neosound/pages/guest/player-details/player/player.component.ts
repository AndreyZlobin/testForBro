import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FilesService } from "../../../../services/files.service";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "./region-plugin";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import { PlayerService } from "../../../../services/player.service";
import { LanguageService } from "../../../../services/language.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";

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
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.filesService
      .getFile({ filename: this.fileName, batchid: this.batchId })
      .subscribe(res => {
        this.fileUrl = res.url;
        this.filesService
          .getAudioWaveForm({ filename: this.fileName, batchid: this.batchId })
          .subscribe(
            meta => {
              if (meta.data && meta.message === "Success") {
                let peaks = [];
                if (meta.data.data[0] instanceof Array || meta.data.channels === 1) {
                  peaks = meta.data.data;
                } else {
                  peaks = [[],[]];
                  const datalen = meta.data.data.length;
                  for (let i = 0; i < datalen/2; i++) {
                    if (i % 2) {
                      peaks[1].push(meta.data.data[2*i]);
                      peaks[1].push(meta.data.data[2*i+1]);
                    } else {
                      peaks[0].push(meta.data.data[2*i]);
                      peaks[0].push(meta.data.data[2*i+1]);
                    }
                  }
                }
                this.wavesurfer = WaveSurfer.create({
                  container: "#waveform",
                  waveColor: "#0098d9",
                  progressColor: "#a4abb3",
                  normalize: true,
                  renderer: CanvasDrawer,
                  height: 60,
                  splitChannels: true,
                  backend: "MediaElement",
                  plugins: [
                    TimelinePlugin.create({
                      container: "#timelineContainer"
                    }),
                    RegionsPlugin.create({}),
                  ]
                });
                this.wavesurfer.load(this.fileUrl, peaks, "auto");
                this.wavesurfer.on("ready", () => {
                  setTimeout(() => {
                    this.regions.map(region => {
                      this.wavesurfer.addRegion(region);
                    });
                  }, 10);
                });
                this.wavesurfer.on("audioprocess", time => {
                  this.playerService.setActive(time);
                });
              } else {
                this.toastrService.error("This file to long to be played");
              }
            },
            error => {
              this.toastrService.error("This file to long to be played");
            }
          );
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
  }
  ngOnDestroy() {
    this.wavesurfer && this.wavesurfer.destroy();
  }
}
