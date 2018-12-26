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
  emotionsAnger;
  emotionsAge;
  emotionsFourclass;
  emotionsSounds;
  emotionsGender;
  currentTab = 'anger';
  tabsDisabled = false;
  isScroll = false;
  duration = 0;

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
          batchid: decodeURIComponent(params.batchid),
        };
        this.filesService.getFile(this.fileParams).subscribe(res => {
          this.fileUrl = res.url;
          this.loadAudio();
        },
        (e) => {
          this.errorMessage = e.error.message;
          if (e.status === 502 || e.status === 404 || e.status === 429) {this.router.navigateByUrl('/404');}
        });

        this.filesService.setQuickFileParams({
          'batchid': decodeURIComponent(params.batchid),
          'filename': decodeURIComponent(params.filename),
        });
      }
    },
    (e) => {
      if (e.status === 502 || e.status === 404 || e.status === 429) {this.router.navigateByUrl('/404');}
      this.errorMessage = e.error.message;
    });

    if (!this.fileParams) {
      // this.router.navigateByUrl('/');
    }
    if (this.fileParams) {
      this.filesService.getFile(this.fileParams).subscribe(res => {
        this.fileUrl = res.url;
        // this.duration = res.duration;
        // this.initWaveSurfer();
        this.loadAudio();
      },
      (e) => {
        if (e.status === 502 || e.status === 404 || e.status === 429) {this.router.navigateByUrl('/404');}
        this.errorMessage = e.error.message;
      });
    }
  }

  ngAfterViewInit() {
    // const vid: any = document.getElementById("audio1");
    // vid.onloadeddata = () => {
    //     this.duration = vid.duration;
    //     this.initWaveSurfer();
    // };
  }

  initWaveSurfer() {
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
            timeInterval: this.timeInterval,
            formatTimeCallback: (v) => {
              const date = new Date(null);
              date.setSeconds(Math.round(v));
              if (Math.round(v) > 3600) {
                return date.toISOString().substr(12, 8);
              }
              return date.toISOString().substr(14, 5);
            }
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
        console.log(this.wavesurfer.getDuration(), this.wavesurfer );

        // if (this.duration !== this.wavesurfer.getDuration()) {
        this.wavesurfer.toggleScroll();
        //   this.wavesurfer.timeline.params.timeInterval = 10;
        // }
        // this.duration = this.wavesurfer.getDuration();

        // this.wavesurfer.destroy();
        // this.loadAudio();
        // this.wavesurfer.timeline.removeOldCanvases();
        // this.wavesurfer.timeline.drawTimeCanvases();

        // this.wavesurfer.addPlugin(TimelinePlugin.create({
        //   container: "#timelineContainer",
        //   timeInterval: 1,
        //   formatTimeCallback: (v) => {
        //     const date = new Date(null);
        //     date.setSeconds(Math.round(v));
        //     if (Math.round(v) > 3600) {
        //       return date.toISOString().substr(12, 8);
        //     }
        //     return date.toISOString().substr(14, 5);
        //   },
        // })).initPlugin('timeline');
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
  }

  get timeInterval() {
    if (this.duration === 0) {
      return 1;
    }
    return this.duration / 30;
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
console.log(res);

      this.duration = res.result.duration;
      this.initWaveSurfer();
      this.loadAudio();
      if (this.results.result || this.attempsCount < 0) {
        clearInterval(this.intervalRef);
      }
      if (this.results.result) {
        this.analysisResult = this.results.result;

        if (this.results.result.uris.anger) {
          this.filesService
            .getFileResultJson({
              uri: this.results.result.uris.anger,
            })
            .subscribe(jsonData => {
                this.emotionsAnger = jsonData.data.ints;
                this.emotionsSounds = jsonData.data.music;
                this.emotions = this.emotionsAnger;
                this.setRegions();
              },
              (e) => this.errorMessage = e.error.message,
            );
        }
        /*this.filesService
          .getFileResultJson({
            uri: this.results.result.uris.age,
          })
          .subscribe(jsonData => {
            this.emotionsAge = jsonData.data.ints;
            this.setRegions();
          },
          (e) => this.errorMessage = e.error.message,
          );*/

          /*this.filesService
          .getFileResultJson({
            uri: this.results.result.uris.fourclass,
          })
          .subscribe(jsonData => {
            this.emotionsFourclass = jsonData.data.ints;
            this.setRegions();
          },
          (e) => this.errorMessage = e.error.message,
          );*/

          /*this.filesService
            .getFileResultJson({
              uri: this.results.result.uris.sounds,
            })
            .subscribe(jsonData => {
              this.emotionsSounds = jsonData.data.ints;
              this.setRegions();
            },
            (e) => this.errorMessage = e.error.message,
            );*/

        /*this.filesService
        .getFileResultJson({
          uri: this.results.result.uris.gender,
        })
        .subscribe(jsonData => {
          this.emotionsGender = jsonData.data.ints;
          this.setRegions();
        },
        (e) => this.errorMessage = e.error.message,
        );*/
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
    this.wavesurfer.clearRegions();
    for (let index = 0; index < this.emotions.length; index++) {
      const element = this.emotions[index];
      this.wavesurfer.addRegion({
        start: element[0],
        end: element[1],
        color: this.getColor(element[3], element[2]),
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

  getColor(val: any, type?: string) {
    switch (this.currentTab) {
      case 'anger':
        return 'rgba(255, ' + (255 - (val - 50) * 5) + ', ' + (255 - (val - 50) * 5) + ', 0.7)';
      case 'age':
        if (type === 'young') return 'rgba(255,0,0, 0.7)';
        if (type === 'mid') return 'rgba(0,255,0, 0.7)';
        if (type === 'old') return 'rgba(0,0,255, 0.7)';
        break;
      case 'gender':
        if (type === 'w') return 'rgba(255,0,0, 0.7)';
        if (type === 'm') return 'rgba(0,0,255, 0.7)';
        break;
      case 'beta':
        if (type === 'Anger') return 'rgba(255, ' + (255 - (val - 50) * 5) + ', ' + (255 - (val - 50) * 5) + ', 0.7)';
        if (type === 'Neutral') return 'rgba(255, 255, 255, 0)';
        if (type === 'Happy') return  'rgba(' + (255 - (val - 50) * 5) + ', 255, ' + (255 - (val - 50) * 5) + ', 0.7)';
        if (type === 'Sadness') return 'rgba(' + (255 - (val - 50) * 5) + ', ' + (255 - (val - 50) * 5) + ', 255, 0.7)';
        break;
      case 'sounds':
        return 'rgba(0,255,0, 0.7)';
      default:
        break;
    }
    return 'rgba(255,0,0, 0.1)';
  }

  gotoPosition(ms) {
    // console.log(ms, this.wavesurfer.getDuration());
    // console.log(ms / this.wavesurfer.getDuration());
    this.wavesurfer.seekTo(ms / this.wavesurfer.getDuration());
  }

  ngOnDestroy() {
    this.subRoute.unsubscribe();
    this.play();
    this.wavesurfer.destroy();
  }

  setTab(tab) {
    this.currentTab = tab;
    this.tabsDisabled = true;
    setTimeout(() => this.tabsDisabled = false, 3000);
    switch (tab) {
      case 'anger':
        this.emotions = this.emotionsAnger;
        break;
      case 'age':
        this.emotions = this.emotionsAge;
        break;
      case 'gender':
        this.emotions = this.emotionsGender;
        break;
      case 'beta':
        this.emotions = this.emotionsFourclass;
        break;
      case 'sounds':
        this.emotions = this.emotionsSounds;
        break;

      default:
        break;
    }
    this.setRegions();
  }

  toggleScroll() {
    this.wavesurfer.toggleScroll();
  }
}
