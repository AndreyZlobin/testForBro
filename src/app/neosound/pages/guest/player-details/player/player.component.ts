import { Component, OnInit, Input } from "@angular/core";
import { FilesService } from "../../../../services/files.service";
import * as WaveSurfer from "wavesurfer.js";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";

import CanvasDrawer from "./canvas-drawer";

@Component({
  selector: "ngx-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  private wavesurfer: any;
  private fileUrl: string;
  private waveFormData: any;
  private peekCache: any;
  @Input() fileName: string;
  @Input() batchId: string;

  constructor(
    private filesService: FilesService,
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
                waveColor: "#3399CC",
                progressColor: "#1CACE3",
                renderer: CanvasDrawer,
                barWidth: 3,
                height: 60,
                splitChannels: true,
                backend: 'MediaElement',
              });
              this.wavesurfer.load(this.fileUrl, meta.data.data, 'auto');
            }
          });
      });
  }
  play() {
    this.wavesurfer.play();
  }
}
