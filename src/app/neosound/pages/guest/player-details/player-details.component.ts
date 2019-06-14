import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { PlayerService } from "../../../services/player.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = true;
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
  errorMessage = "";
  emotionsAnger;
  emotionsAge;
  emotionsFourclass;
  emotionsSounds;
  emotionsGender;
  sttfulltext;
  keywords;
  emotionsSttAnger;
  currentTab = "text";
  tabsDisabled = false;
  isScroll = false;
  duration = 0;
  radioModel = "Log";
  onhold;
  @HostListener("document:keyup", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === "Space") {
      this.play();
      event.stopPropagation();
    }
  }
  constructor(
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private toastrService: ToastrService,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
  ) {
    this.fileParams = this.filesService.getQuickFileParams();
    // test file
    // this.fileParams = {batchid: 1, filename: '2018-9-18_0:1:11.wav'};

    this.subRoute = this.route.params.subscribe(
      params => {
        if (params && params.filename && params.batchid) {
          this.fileParams = {
            filename: decodeURIComponent(params.filename),
            batchid: decodeURIComponent(params.batchid)
          };
          this.filesService.getFile(this.fileParams).subscribe(
            res => {
              this.fileUrl = res.url;
              this.loadAudio();
            },
            e => {
              this.errorMessage = e.error.message;
              if (e.status === 502 || e.status === 404 || e.status === 429) {
                this.router.navigateByUrl("/404");
              }
            }
          );

          this.filesService.setQuickFileParams({
            batchid: decodeURIComponent(params.batchid),
            filename: decodeURIComponent(params.filename)
          });
        }
      },
      e => {
        if (e.status === 502 || e.status === 404 || e.status === 429) {
          this.router.navigateByUrl("/404");
        }
        this.errorMessage = e.error.message;
      }
    );

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
          timeInterval: pxPerSec => {
            let retval = 1;
            if (pxPerSec >= 25 * 100) {
              retval = 0.01;
            } else if (pxPerSec >= 25 * 40) {
              retval = 0.025;
            } else if (pxPerSec >= 25 * 10) {
              retval = 0.1;
            } else if (pxPerSec >= 25 * 4) {
              retval = 0.25;
            } else if (pxPerSec >= 25) {
              retval = 1;
            } else if (pxPerSec * 5 >= 25) {
              retval = 5;
            } else if (pxPerSec * 15 >= 25) {
              retval = 15;
            } else {
              retval = Math.ceil(0.5 / pxPerSec) * 60;
            }
            return retval;
          },
          primaryLabelInterval: pxPerSec => {
            let retval = 1;
            if (pxPerSec >= 25 * 100) {
              retval = 15;
            } else if (pxPerSec >= 25 * 40) {
              retval = 10;
            } else if (pxPerSec >= 25 * 10) {
              retval = 15;
            } else if (pxPerSec >= 25 * 4) {
              retval = 15;
            } else if (pxPerSec >= 25) {
              retval = 15;
            } else if (pxPerSec * 5 >= 25) {
              retval = 15;
            } else if (pxPerSec * 15 >= 25) {
              retval = 18;
            } else {
              retval = Math.ceil(0.5 / pxPerSec) * 60;
            }
            return retval;
          },
          secondaryLabelInterval: pxPerSec => {
            return Math.floor(10 / this.timeInterval(pxPerSec));
          },
          formatTimeCallback: (seconds, pxPerSec) => {
            seconds = Number(seconds);
            const minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
            let secondsStr = Math.round(seconds).toString();
            if (pxPerSec >= 25 * 10) {
              secondsStr = seconds.toFixed(0);
            } else if (pxPerSec >= 25 * 1) {
              secondsStr = seconds.toFixed(0);
            }
            if (minutes > 0) {
              if (seconds < 10) {
                secondsStr = "0" + secondsStr;
              }
              if (minutes < 10) {
                return `0${minutes}:${secondsStr}`;
              }
              return `${minutes}:${secondsStr}`;
            }
            return "00:" + secondsStr;
          }
        })
      ]
    });
    this.loadAudio();
    this.wavesurfer.on("ready", () => {
      this.wavesurfer.toggleScroll();
      this.wavesurferReady = true;
      this.isLoading = false;
      this.cdRef.detectChanges();
      this.setRegions();
    });
    this.wavesurfer.on("audioprocess", time => {
      this.playerService.setActtive(time);
    });
  }

  timeInterval(pxPerSec) {
    let retval = 1;
    if (pxPerSec >= 25 * 100) {
      retval = 0.01;
    } else if (pxPerSec >= 25 * 40) {
      retval = 0.025;
    } else if (pxPerSec >= 25 * 10) {
      retval = 0.1;
    } else if (pxPerSec >= 25 * 4) {
      retval = 0.25;
    } else if (pxPerSec >= 25) {
      retval = 0.01;
    } else if (pxPerSec * 5 >= 25) {
      retval = 5;
    } else if (pxPerSec * 15 >= 25) {
      retval = 15;
    } else {
      retval = Math.ceil(0.5 / pxPerSec) * 60;
    }
    return retval;
  }

  loadAudio() {
    if (this.wavesurfer && this.fileUrl) {
      this.wavesurfer.load(this.fileUrl);
    }
  }

  play() {
    this.wavesurfer && this.wavesurfer.playPause();
  }
  trackElement(index: number, element: any) {
    return element ? element.guid : null;
  }
  ngOnInit() {
    this.getInfo();
    this.attempsCount = 20;
    this.intervalRef = setInterval(() => {
      this.attempsCount--;
      this.getInfo();
    }, 20000);
  }

  copyToClipboard(text: string): void {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.toastrService.info("Copied!");
  }
  getInfo() {
    this.filesService.getFileResultDetails(this.fileParams).subscribe(
      res => {
        this.results = res;

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
              // this.onhold = this.results.result.anger.ints;
              this.setTab('anger');
              // this.setRegions();
            }
            if (this.results.result.anger.music) {
              this.emotionsSounds = this.results.result.anger.music;
              this.setRegions();
            }
          }
          if (this.results.result.stt) {
            if (this.results.result.stt.fulltext) {
              this.sttfulltext = this.results.result.stt.fulltext;
            }
          }
          if (this.results.result.stt) {
            if (this.results.result.stt.keywords && Array.isArray(this.results.result.stt.keywords)) {
              this.keywords = this.results.result.stt.keywords;
            } else {
              this.keywords = this.results.result.stt.keywords.stop.concat(this.results.result.stt.keywords.miss);
            }
          }
          if (this.results.result.merged) {
            if (this.results.result.merged.intprobs) {
              this.emotionsSttAnger = this.results.result.merged.intprobs;
              this.emotions = this.emotionsSttAnger;
              this.setTab('text');
            }
          }
        }
      },
      e => (this.errorMessage = e.error.message),
    );
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  // @ts-ignore
  setRegions() {
    const inputData = this.emotionsSounds ? this.emotions.concat(this.emotionsSounds) : this.emotions;
    if (!this.wavesurferReady || !this.emotions) return;
    this.wavesurfer.clearRegions();
    const data = inputData || this.emotions;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      this.wavesurfer.addRegion({
        start: element[0],
        end: element[1],
        color: this.getColor(element[3], element[2], !element[2]),
      });
    }

    // if (this.currentTab === "text" && this.emotionsAnger) {
    if (this.emotionsAnger) {
      for (let index = 0; index < this.emotionsAnger.length; index++) {
        const element = this.emotionsAnger[index];
        this.wavesurfer.addRegion({
          start: element[0],
          end: element[1],
          color: this.getColor(element[3], element[2], !element[2]),
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

  getColor(val: any, type?: string, isMusic = false) {
    if (isMusic) {
      return "rgba(0,255,0, 0.7)";
    }
    switch (this.currentTab) {
      case "anger":
        return (
          "rgba(255, " +
          (255 - (val - 50) * 5) +
          ", " +
          (255 - (val - 50) * 5) +
          ", 0.7)"
        );
      case "age":
        if (type === "young") return "rgba(255,0,0, 0.7)";
        if (type === "mid") return "rgba(0,255,0, 0.7)";
        if (type === "old") return "rgba(0,0,255, 0.7)";
        break;
      case "gender":
        if (type === "w") return "rgba(255,0,0, 0.7)";
        if (type === "m") return "rgba(0,0,255, 0.7)";
        break;
      case "beta":
        if (type === "Anger")
          return (
            "rgba(255, " +
            (255 - (val - 50) * 5) +
            ", " +
            (255 - (val - 50) * 5) +
            ", 0.7)"
          );
        if (type === "Neutral") return "rgba(255, 255, 255, 0)";
        if (type === "Happy")
          return (
            "rgba(" +
            (255 - (val - 50) * 5) +
            ", 255, " +
            (255 - (val - 50) * 5) +
            ", 0.7)"
          );
        if (type === "Sadness")
          return (
            "rgba(" +
            (255 - (val - 50) * 5) +
            ", " +
            (255 - (val - 50) * 5) +
            ", 255, 0.7)"
          );
        break;
      case "sounds":
        return "rgba(0,255,0, 0.7)";
      case "text":
        const x = val / 2 + 50;
        return (
          "rgba(255, " +
          (255 - (x - 50) * 5) +
          ", " +
          (255 - (x - 50) * 5) +
          ", 0.7)"
        );
      default:
        break;
    }
    return "rgba(255,0,0, 0.1)";
  }

  gotoPosition(ms) {
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
    setTimeout(() => (this.tabsDisabled = false), 3000);
    switch (tab) {
      case "anger":
        this.emotions = this.emotionsAnger;
        break;
      case "age":
        this.emotions = this.emotionsAge;
        break;
      case "gender":
        this.emotions = this.emotionsGender;
        break;
      case "beta":
        this.emotions = this.emotionsFourclass;
        break;
      case "sounds":
        this.emotions = this.emotionsSounds;
        break;
      case "text":
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

  get secondaryColor() {
    return this.dataService.config && (this.dataService.config as any).colors && (this.dataService.config as any).colors.secondary || 'rgb(0, 154, 210)';
  }
}
