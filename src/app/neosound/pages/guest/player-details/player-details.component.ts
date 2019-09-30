import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
  ViewChild
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { PlayerService } from "../../../services/player.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";
import { PlayerComponent } from "./player/player.component";

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(PlayerComponent)
  player: PlayerComponent;
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
  misswords = [];
  misswordsNotFound = [];
  emotionsSttAnger;
  currentTab = "text";
  tabsDisabled = false;
  isScroll = false;
  duration = 0;
  radioModel = "Log";
  onhold;
  greySpeaker = "";
  regions = [];
  changed = false;
  @HostListener("document:keyup", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === "Space") {
      this.player.play();
      event.stopPropagation();
    }
  }
  constructor(
    private filesService: FilesService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private toastrService: ToastrService,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService
  ) {
    this.fileParams = this.filesService.getQuickFileParams();
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith("/file/")) {
          const batchid = this.route.snapshot.params["batchid"];
          const filename = this.route.snapshot.params["filename"];
          this.fileUrl = null;
          this.filterService.lastFileId = decodeURIComponent(filename);
          if (filename && batchid) {
            this.fileParams = {
              filename: decodeURIComponent(filename),
              batchid: decodeURIComponent(batchid)
            };
            this.filesService.getFile(this.fileParams).subscribe(
              res => {
                this.fileUrl = res.url;
                this.changed = true;
                this.getInfo();
              },
              e => {
                this.errorMessage = e.error.message;
                if (e.status === 502 || e.status === 404 || e.status === 429) {
                  this.router.navigateByUrl("/404");
                }
              }
            );
          }
        }
      }
    });
  }

  ngAfterViewInit() {}
  trackElement(index: number, element: any) {
    return element ? element.guid : null;
  }
  ngOnInit() {
  }

  copyToClipboard(text: string): void {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = text.replace(/(<([^>]+)>)/gi, "");
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
        if (this.results.result || this.attempsCount < 0) {
          clearInterval(this.intervalRef);
        }
        if (this.results.result) {
          if (this.results.result.anger) {
            if (this.results.result.anger.ints) {
              this.emotionsAnger = this.results.result.anger.ints;
              this.emotions = this.emotionsAnger;
              this.setTab("anger");
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
            if (
              this.results.result.stt.keywords &&
              Array.isArray(this.results.result.stt.keywords)
            ) {
              this.keywords = this.results.result.stt.keywords;
              this.misswords = [];
            } else {
              this.keywords = this.results.result.stt.keywords.stop;
              this.misswords = this.results.result.stt.keywords.miss;
              this.misswordsNotFound = this.results.result.stt.keywords.missmiss;
            }
            if (this.results.result.stt.speakers) {
              if (Array.isArray(this.results.result.stt.speakers)) {
                if (this.results.result.stt.speakers.length > 1) {
                  this.greySpeaker = this.results.result.stt.speakers[1];
                }
              } else {
                if (Object.keys(this.results.result.stt.speakers).length > 1) {
                  this.greySpeaker = Object.keys(
                    this.results.result.stt.speakers
                  )[1];
                }
              }
            }
          }

          if (this.results.result.merged) {
            if (this.results.result.merged.intprobs) {
              this.emotionsSttAnger = this.results.result.merged.intprobs;
              this.emotions = this.emotionsSttAnger;
              this.setTab("text");
            }
          }
        }
      },
      e => (this.errorMessage = e.error.message)
    );
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  // @ts-ignore
  setRegions() {
    const inputData = this.emotionsSounds
      ? this.emotions.concat(this.emotionsSounds)
      : this.emotions;
    if (!this.emotions) return;
    const data = inputData || this.emotions;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      this.regions.push({
        start: element[0],
        end: element[1],
        color: this.getColor(element[3], element[2], !element[2])
      });
    }

    if (this.emotionsAnger) {
      for (let index = 0; index < this.emotionsAnger.length; index++) {
        const element = this.emotionsAnger[index];
        this.regions.push({
          start: element[0],
          end: element[1],
          color: this.getColor(element[3], element[2], !element[2])
        });
      }
    }
  }

  pushRegions() {
    this.player.setRegions(this.regions);
  }

  getColor(val: any, type?: string, isMusic = false) {
    if (isMusic) {
      return "rgba(0,255,0, 1)";
    }
    switch (this.currentTab) {
      case "anger":
        return (
          "rgba(255, " +
          (255 - (val - 50) * 5) +
          ", " +
          (255 - (val - 50) * 5) +
          ", 1)"
        );
      case "age":
        if (type === "young") return "rgba(255,0,0, 1)";
        if (type === "mid") return "rgba(0,255,0, 1)";
        if (type === "old") return "rgba(0,0,255, 1)";
        break;
      case "gender":
        if (type === "w") return "rgba(255,0,0, 1)";
        if (type === "m") return "rgba(0,0,255, 1)";
        break;
      case "beta":
        if (type === "Anger")
          return (
            "rgba(255, " +
            (255 - (val - 50) * 5) +
            ", " +
            (255 - (val - 50) * 5) +
            ", 1)"
          );
        if (type === "Neutral") return "rgba(255, 255, 255, 0)";
        if (type === "Happy")
          return (
            "rgba(" +
            (255 - (val - 50) * 5) +
            ", 255, " +
            (255 - (val - 50) * 5) +
            ", 1)"
          );
        if (type === "Sadness")
          return (
            "rgba(" +
            (255 - (val - 50) * 5) +
            ", " +
            (255 - (val - 50) * 5) +
            ", 255, 1)"
          );
        break;
      case "sounds":
        return "rgba(0,255,0, 1)";
      case "text":
        const x = val / 2 + 50;
        return (
          "rgba(255, " +
          (255 - (x - 50) * 5) +
          ", " +
          (255 - (x - 50) * 5) +
          ", 1)"
        );
      default:
        break;
    }
    return "rgba(255,0,0, 0.1)";
  }

  gotoPosition(ms) {
    this.player.seekTo(ms);
  }

  ngOnDestroy() {}

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

  t(v) {
    return LanguageService.t(v);
  }

  get secondaryColor() {
    return (
      (this.dataService.config &&
        (this.dataService.config as any).colors &&
        (this.dataService.config as any).colors.secondary) ||
      "rgb(0, 154, 210)"
    );
  }

  getCompliancePercents() {
    if (this.misswords.length || this.misswordsNotFound.length) {
      const perc =
        this.misswords.length /
        (this.misswords.length + this.misswordsNotFound.length);
      return Math.round(perc * 100) + "%";
    }
    return "N/A";
  }
}
