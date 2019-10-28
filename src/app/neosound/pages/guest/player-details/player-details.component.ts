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
  stopwords: ["tets1", "test2"];
  colors = colors;
  sankey = {
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
        data: [
          { name: "sentiment" },
          { name: "Neutral" },
          { name: "call" },
          { name: "Negative" },
          { name: "want" }
        ],
        links: [
          { source: "sentiment", target: "Neutral", value: 2 },
          { source: "Neutral", target: "call", value: 2 },
          { source: "sentiment", target: "Negative", value: 1 },
          { source: "Negative", target: "want", value: 1 }
        ],
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
  isLoading: boolean = true;
  fileParams;
  results;
  treeRadialData: any = {
    color: this.colors,
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove"
    },
    series: [
      {
        type: "tree",
        data: [
          {
            name: "sentiment",
            children: [
              {
                name: "Neutral",
                children: [
                  {
                    name: "call",
                    value: 2,
                    children: [
                      {
                        name: "who \u0027s calling my name \u0027s hayley",
                        value: 1
                      },
                      {
                        name:
                          "i \u0027m calling from lindsay wealth part of delenn degrees how \u0027re you doing",
                        value: 1
                      }
                    ]
                  }
                ],
                value: 2
              },
              {
                name: "Negative",
                children: [
                  {
                    name: "want",
                    value: 1,
                    children: [
                      {
                        name: "not that i wanted to do staff no",
                        value: 1
                      }
                    ]
                  }
                ],
                value: 1
              }
            ],
            value: 3
          }
        ],
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
  popularWords: any[] = [
    { text: "yeah", weight: 100 },
    { text: "know", weight: 22 },
    { text: "okay", weight: 33 },
    { text: "get", weight: 44 }
  ];
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
        if (event.url.startsWith("/file/")) {
          const batchid = this.route.snapshot.params["batchid"];
          const filename = this.route.snapshot.params["filename"];
          this.filterService.lastFileId = decodeURIComponent(filename);
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
