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
  private waveFormData: string;
  private peekCache: [number[], number[]];
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
      });
    this.filesService
      .getAudioWaveForm({ filename: this.fileName, batchid: this.batchId })
      .subscribe(res => {
        const oReq = new XMLHttpRequest();
        oReq.onload = e => {
          this.peekCache = oReq.response;
        };
        oReq.open("GET", res.url);
        oReq.send();
      });
  }
}
