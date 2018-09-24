import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  fileParams;
  results;
  emotions: any[];
  intervalRef;
  analysisResult;
  chartData;
  fileUrl;
  wavesurfer;
  wavesurferReady = false;
  attempsCount = 20;
  subRoute: Subscription;
  zoomLevel = 200;
  errorMessage = '';

  constructor(
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fileParams = this.filesService.getQuickFileParams();
    // test file
    // this.fileParams = {batchid: 1, filename: '2018-9-18_0:1:11.wav'};

    this.subRoute = this.route.params.subscribe(params => {
      if (params && params.filename && params.batchid) {
        this.fileParams = {
          filename: decodeURIComponent(params.filename),
          batchid: decodeURIComponent(params.batchid)
        };
        this.filesService.getFile(this.fileParams).subscribe(res => {
          this.fileUrl = res.url;
          this.loadAudio();
        },
        (e) => this.errorMessage = e.error.message,
        );
      }
    },
    (e) => this.errorMessage = e.error.message,
    );

    if (!this.fileParams) {
      // this.router.navigateByUrl('/');
    }
    if (this.fileParams) {
      this.filesService.getFile(this.fileParams).subscribe(res => {
        this.fileUrl = res.url;
        this.loadAudio();
      },
      (e) => this.errorMessage = e.error.message,
      );
    }
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.wavesurfer = WaveSurfer.create({
        container: "#myWavesurferContainer",
        waveColor: "#3399CC",
        progressColor: "#1CACE3",
        scrollParent: true,
        plugins: [
          RegionsPlugin.create({
            // plugin options ...
          }),
          TimelinePlugin.create({
            container: "#timelineContainer",
            timeInterval: 0.1
          })
        ]
      });
      this.loadAudio();
      this.wavesurfer.on("ready", () => {
        // http://wavesurfer-js.org/plugins/regions.html
        // const timeline = Object.create(TimelinePlugin); // WaveSurfer.Timeline);

        // timeline.init({
        //     wavesurfer: this.wavesurfer,
        //     container: '#myWavesurferContainer',
        // });
        const self = this;
        // const zoom: any = document.querySelector("#slider");
        // const self = this;
        // const zoom: any = document.querySelector('#slider');
        // zoom.oninput = function () {
        //   self.wavesurfer.zoom(Number(this.value));
        // };

        this.wavesurferReady = true;
        // this.emotions = [
        //   ["4.75", "5.5", "anger", "80.8"],
        //   ["100.75", "305.5", "anger", "55.8"],
        // ];
        this.setRegions();
      });
    });
  }

  loadAudio() {
    if (this.wavesurfer && this.fileUrl) {
      this.wavesurfer.load(this.fileUrl);
    }
  }

  play() {
    this.wavesurfer.playPause();
  }

  ngOnInit() {
    this.getInfo();
    this.attempsCount = 20;
    this.intervalRef = setInterval(() => {
      this.attempsCount--;
      this.getInfo();
    }, 20000);
  }

  getInfo() {
    this.filesService.listFileResults(this.fileParams).subscribe(res => {
      this.results = res;
      if (this.results.results.length || this.attempsCount < 0) {
        clearInterval(this.intervalRef);
      }
      if (this.results.results && this.results.results[0]) {
        this.analysisResult = this.results.results;

        this.filesService
          .getFileResultJson({
            uri: this.results.results[0].identity.uri
          })
          .subscribe(jsonData => {
            this.emotions = jsonData.json.emosp;
            this.setRegions();
          },
          (e) => this.errorMessage = e.error.message,
          );
      }
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  setRegions() {
    if (!this.wavesurferReady || !this.emotions) return;
    for (let index = 0; index < this.emotions.length; index++) {
      const element = this.emotions[index];
      this.wavesurfer.addRegion({
        start: element[0],
        end: element[1],
        color: this.getColor(element[3])
      });
    }
  }
  zoomIn() {
    if (this.zoomLevel > 20000) return this.zoomLevel;
    this.zoomLevel = this.zoomLevel * 10;
    this.wavesurfer.zoom(this.zoomLevel);
  }
  zoomOut() {
    if (this.zoomLevel < 200) return this.zoomLevel;
    this.zoomLevel = this.zoomLevel / 10;
    this.wavesurfer.zoom(this.zoomLevel);
  }
  getColor(val) {
    if (val > 80) return "rgba(255,0,0, 0.1)";
    if (val > 70) return "rgba(255, 165, 0, 0.1)";
    if (val > 50) return "rgba(255, 255, 0, 0.1)";
  }

  gotoPosition(ms) {
    console.log(ms, this.wavesurfer.getDuration());
    // console.log(ms / this.wavesurfer.getDuration());
    this.wavesurfer.seekTo(ms / this.wavesurfer.getDuration());
  }

  ngOnDestroy() {
    this.subRoute.unsubscribe();
  }
}