import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";

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
  sttfulltext;
  emotionsSttAnger;
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
    // if (this.fileParams) {
    //   this.filesService.getFile(this.fileParams).subscribe(res => {
    //     this.fileUrl = res.url;
    //     // this.duration = res.duration;
    //     // this.initWaveSurfer();
    //     this.loadAudio();
    //   },
    //   (e) => {
    //     if (e.status === 502 || e.status === 404 || e.status === 429) {this.router.navigateByUrl('/404');}
    //     this.errorMessage = e.error.message;
    //   });
    // }
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
        this.wavesurfer.toggleScroll();
        this.wavesurferReady = true;
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
    this.filesService.getFileResultDetails(this.fileParams).subscribe(res => {
      this.results = res;
      console.log(res);

      this.duration = res.result.duration;
      this.initWaveSurfer();
      this.loadAudio();
      if (this.results.result || this.attempsCount < 0) {
        clearInterval(this.intervalRef);
      }
      if (this.results.result) {
        // this.analysisResult = this.results.result;

        if (this.results.result.anger) {
          if (this.results.result.anger.ints) {
            this.emotionsAnger = this.results.result.anger.ints;
            this.emotions = this.emotionsAnger;
            this.setRegions();
          }
          if (this.results.result.anger.music) {
            this.emotionsSounds = this.results.result.anger.music;
          }
        }
        if (this.results.result.stt) {
          if (this.results.result.stt.fulltext) {
            this.sttfulltext = this.results.result.stt.fulltext;
          }
        }
        if (this.results.result.merged) {
          if (this.results.result.merged.intprobs) {
            this.emotionsSttAnger = this.results.result.merged.intprobs;
          }
        }
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

  // @ts-ignore
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

    if (this.currentTab === 'text' && this.emotionsAnger) {
      for (let index = 0; index < this.emotionsAnger.length; index++) {
        const element = this.emotionsAnger[index];
        this.wavesurfer.addRegion({
          start: element[0],
          end: element[1],
          color: this.getColor(element[3], element[2]),
        });
      }
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
      case 'text':
        const x = val / 2 + 50;
        return 'rgba(255, ' + (255 - (x - 50) * 5) + ', ' + (255 - (x - 50) * 5) + ', 0.7)';
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
      case 'text':
        this.emotions = this.emotionsSttAnger;
        break;

      default:
        break;
    }
    this.setRegions();
  }

  toggleScroll() {
    this.wavesurfer.toggleScroll();
  }

  t(v) {
    return LanguageService.t(v);
  }
  zoom($event) {
    this.wavesurfer.zoom(Number($event.target.value));
  }
}
