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

export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487"
];

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(PlayerComponent)
  player: PlayerComponent;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  currentView: string;
  colors = colors;
  sankey: any;
  isLoading: boolean = true;
  fileParams;
  results;
  treeRadialData: any;
  popularWords: any;
  emotions: any[] = [];
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
  routeSub: Subscription;
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
    private toastrService: ToastrService,
    private dataService: DataService
  ) {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        this.fileUrl = null;
        this.regions = [];
        this.currentView = "analytic";
        if (event.url.startsWith("/file/")) {
          const batchid = this.route.snapshot.params["batchid"];
          const filename = this.route.snapshot.params["filename"];
          if (filename && batchid) {
            if (
              this.fileParams &&
              filename === this.fileParams.filename &&
              batchid === this.fileParams.batchid
            ) {
              return;
            }
            this.fileParams = {
              filename: decodeURIComponent(filename),
              batchid: decodeURIComponent(batchid)
            };
            this.filesService.getFile(this.fileParams).subscribe(
              res => {
                this.fileUrl = res.url;
                this.changed = true;
                this.getInfo();
                this.getAnalytics(
                  this.fileParams.batchid,
                  this.fileParams.filename
                );
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
  ngOnInit() {}
  changeTab(event: any): void {
    if (this.currentView === "player") {
      this.currentView = "analytic";
      return;
    }
    if (this.currentView === "analytic") {
      this.currentView = "player";
      return;
    }
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
            }
            if (this.results.result.anger.music) {
              this.emotionsSounds = this.results.result.anger.music;
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
            }
          }
        }
        this.setRegions();
      },
      e => (this.errorMessage = e.error.message)
    );
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  setRegions(): void {
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
    setTimeout(() => {
      this.player.setRegions(this.regions);
    }, 1000);
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

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
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

  getAnalytics(batchid: string, filename: string) {
    this.isLoading = true;
    this.filesService
      .getDetailsEchartData({ batchid, filename })
      .subscribe(data => {
        if (data.sankeyData) {
          this.sankey = {
            tooltip: {
              trigger: "item",
              triggerOn: "mousemove"
            },
            color: this.colors,
            graph: {
              color: this.colors
            },
            series: [
              {
                type: "sankey",
                data: data.sankeyData.nodes,
                links: data.sankeyData.links,
                focusNodeAdjacency: "allEdges",
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: "#aaa"
                  }
                },
                lineStyle: {
                  normal: {
                    color: "source",
                    curveness: 0.5
                  }
                }
              }
            ]
          };
        }
        if (data.treeRadialData) {
          this.treeRadialData = {
            color: this.colors,
            tooltip: {
              trigger: "item",
              triggerOn: "mousemove"
            },
            series: [
              {
                type: "tree",
                data: [data.treeRadialData],
                top: "18%",
                bottom: "14%",
                layout: "radial",
                symbol: "emptyCircle",
                symbolSize: 7,
                initialTreeDepth: 1,
                animationDurationUpdate: 750
              }
            ]
          };
        }
        if (data.popularWords) {
          this.popularWords = data.popularWords;
        }
        this.isLoading = false;
      });
  }
}
