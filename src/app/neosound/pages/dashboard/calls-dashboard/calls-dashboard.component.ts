import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CloudData } from "angular-tag-cloud-module";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatepickerOptions } from "ng2-datepicker";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { DataService } from "../../../shared";
import { AnalyticsService } from "../../../services/analytics.service";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../../services/language.service";

export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487"
]; //shine

const rgbToHex = rgb => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const fullColorHex = (r, g, b) => {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red + green + blue;
};

@Component({
  selector: "app-calls-dashboard",
  templateUrl: "./calls-dashboard.component.html",
  styleUrls: ["./calls-dashboard.component.scss"]
})
export class CallsDashboardComponent implements OnInit, OnChanges {
  @Input() dateFrom: string;
  @Input() dateTo: string;
  @Input() batches: string[];
  host: string = "";
  hasData: boolean = false;
  showConfig: boolean = false;
  modalRef: BsModalRef;
  config = {};
  colors = [];
  options: any = {};
  options2: any = {};
  optionsByCalls: any = {};
  public users$: Observable<any>;
  public barChart: any;
  public keyWordChart: any;
  public keyWord2Chart: any;
  public showHitsVsStopwors = false;
  public selectedBatchId: string;
  public datefrom: any;
  public dateto: any;
  public totals = {};
  public data_2 = [];
  public keywords = [];
  public keywords2 = [];
  public loading = true;
  public sentimentData;
  public sentimentTreeRadialData;
  hasSankey = false;
  sankey1: any;
  sankey2: any;
  sankey3: any;
  sankey4: any;
  sankey5: any;
  sankey6: any;
  sankey7: any;
  fileCount: any;
  totalMinutes: any;
  apiCallsCount: any;
  allCallsCount: any;
  batchesUploaded: any;

  public topicChart: any;
  public topics = [];

  fileStat: any = {};
  minutesStat: any = {};
  apiStat: any = {};
  freqWords: any[] = [];
  radialTreeData: any;
  showRadialTreeData: boolean = false;
  primiryColor: string = "#3399cc";
  constructor(
    private router: Router,
    private filesService: FilesService,
    private http: HttpClient,
    private lang: LanguageService,
    private analyticsService: AnalyticsService,
    public dataService: DataService,
    private filterService: FilterService,
    private modalService: BsModalService
  ) {
    this.setColors();
    this.showRadialTreeData = false;
  }

  setColors() {
    this.colors = colors;
  }
  getMinutesStats(param: any = {}) {
    this.filesService.getMinutesStats(param).subscribe(data => {
      this.minutesStat = data;
      this.fileCount = data.fileCount;
      this.totalMinutes = Math.round(data.totalMinutes);
    });
  }
  listBatches() {
    this.filesService.listBatches().subscribe(data => {
      if (data && data.batches) {
        this.batches = data.batches;
      }
    });
  }
  getApiCallsStats(param: any = {}) {
    this.filesService.getApiCallsStats(param).subscribe(data => {
      this.apiCallsCount = data.apiCallsCount;
      this.apiStat = data;
    });
  }
  getFileStats(param: any = {}) {
    this.filesService.getFileStats(param).subscribe(data => {
      this.fileStat = data;
      this.loading = false;
      this.allCallsCount = data.totals.allcallscount;
      this.batchesUploaded = data.totals.batchcount;
      const batches = Object.keys(data.batches);
      if (batches) {
        this.hasData = true;
        const anger = [];
        const all = [];
        const silence = [];
        batches
          .sort(
            (a, b) =>
              data.batches[b]
                .allCallsN /*+ data.batches[a].angerCallsN + data.batches[a].silentCallsN*/ -
              data.batches[a]
                .allCallsN /* + data.batches[b].angerCallsN + data.batches[b].silentCallsN*/
          )
          .slice(0, 6)
          .reverse()
          .forEach(batchName => {
            all.push(data.batches[batchName].allCallsN);
            anger.push(data.batches[batchName].angerCallsN);
            silence.push(data.batches[batchName].silentCallsN);
          });
        const chartData = [
          {
            name: this.t("emotional"),
            type: "bar",
            data: anger
          },
          {
            name: this.t("silence"),
            type: "bar",
            data: silence
          },
          {
            name: this.t("all"),
            type: "bar",
            data: all
          }
        ];
        let maxX = 0;
        let maxY = 0;
        let maxR = 0;
        let minR = 1;
        const buble = batches.map((batchName, index) => {
          if (maxX < data.batches[batchName].silentCallsN) {
            maxX = data.batches[batchName].silentCallsN;
          }
          if (maxY < data.batches[batchName].angerCallsN) {
            maxY = data.batches[batchName].angerCallsN;
          }
          if (maxR < data.batches[batchName].allCallsN) {
            maxR = data.batches[batchName].allCallsN;
          }
          if (data.batches[batchName].allCallsN < minR) {
            minR = data.batches[batchName].allCallsN;
          }
          return {
            name: batchName,
            data: [
              [
                (data.batches[batchName].silentCallsN /
                  data.batches[batchName].allCallsN) *
                  100,
                (data.batches[batchName].angerCallsN /
                  data.batches[batchName].allCallsN) *
                  100,
                data.batches[batchName].allCallsN,
                batchName,
                data.batches[batchName].silentCallsN,
                data.batches[batchName].angerCallsN
              ]
            ],
            type: "scatter",
            symbolSize: data => {
              return this.getRadius(data[2], minR, maxR);
            }
          };
        });

        this.barChart = {
          color: this.colors,
          grid: {
            left: 100
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["emotional", "silence", "all"]
          },
          yAxis: {
            type: "category",
            axisTick: { show: false },
            data: batches.slice(0, 6).reverse()
          },
          xAxis: {
            type: "value",
            name: this.t("Calls"),
            nameLocation: "middle",
            nameGap: 30,
            min: 0,
            max: Math.floor(maxR * 1.1)
          },
          series: chartData
        };

        this.totals = data.totals;

        this.options = {
          color: this.colors,
          backgroundColor: "#fff",
          legend: {
            type: "scroll",
            orient: "vertical",
            right: 10,
            top: 20,
            bottom: 80,
            data: batches
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: "none",
                opacity: 0
              }
            },
            type: "value",
            name: this.t("Silent Calls, %"),
            nameLocation: "middle",
            nameGap: 30,
            axisLabel: {
              formatter: "{value}"
            },
            min: 0,
            max: 140
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: "none",
                opacity: 0
              }
            },
            scale: true,
            type: "value",
            nameLocation: "middle",
            nameGap: 30,
            name: this.t("Emotional Calls, %"),
            axisLabel: {
              formatter: "{value}"
            },
            min: 0,
            max: 40
          },
          tooltip: {
            show: true,
            formatter: function(param) {
              return `${param.data[3]}<br>Calls: ${param.data[2]}<br> Silent: ${param.data[4]}<br> Emotional: ${param.data[5]}`;
            }
          },
          series: buble
        };
        const buble2 = batches.map((batchName, index) => {
          if (maxX < data.batches[batchName].silentCallsN) {
            maxX = data.batches[batchName].silentCallsN;
          }
          if (maxY < data.batches[batchName].angerCallsN) {
            maxY = data.batches[batchName].angerCallsN;
          }
          if (maxR < data.batches[batchName].allCallsN) {
            maxR = data.batches[batchName].allCallsN;
          }
          if (data.batches[batchName].allCallsN < minR) {
            minR = data.batches[batchName].allCallsN;
          }
          return {
            name: batchName,
            data: [
              [
                data.batches[batchName].silentCallsN,
                data.batches[batchName].angerCallsN,
                data.batches[batchName].allCallsN,
                batchName
              ]
            ],
            type: "scatter",
            symbolSize: data => {
              return this.getRadius(data[2], minR, maxR);
            }
          };
        });
        this.options2 = {
          color: this.colors,
          backgroundColor: "#fff",
          legend: {
            type: "scroll",
            orient: "vertical",
            right: 10,
            top: 20,
            bottom: 80,
            data: batches
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: "none",
                opacity: 0
              }
            },
            type: "value",
            name: this.t("Silent Calls"),
            nameLocation: "middle",
            nameGap: 30,
            axisLabel: {
              formatter: "{value}"
            },
            min: 0,
            max: Math.round(maxX * 1.4)
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: "none",
                opacity: 0
              }
            },
            scale: true,
            type: "value",
            nameGap: 30,
            name: this.t("Emotional Calls"),
            nameLocation: "middle",
            axisLabel: {
              formatter: "{value}"
            },
            min: 0,
            max: Math.round(maxY * 1.4)
          },
          tooltip: {
            show: true,
            formatter: function(param) {
              return `${param.data[3]}<br>Calls: ${param.data[2]}<br> Silent: ${param.data[0]}<br> Emotional: ${param.data[1]}`;
            }
          },
          series: buble2
        };
      } else {
        this.hasData = false;
      }
    });
  }
  getTagClowd(param: any = {}) {
    this.filesService.getTagClowd(param).subscribe(data => {
      this.keywords = Object.keys(data.keywords).map(key => {
        return {
          text: key,
          weight: data.keywords[key]
        };
      });
      const sortedKeywords = Object.keys(data.keywords)
        .map(key => {
          return {
            name: key,
            value: data.keywords[key]
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .reverse();
      if (this.dataService.config["colors"].secondary) {
        this.primiryColor = this.dataService.config["colors"].secondary;
        this.host = this.dataService.config["sFtpHost"];
      } else {
        this.primiryColor = "#0098d9";
      }
      if (this.dataService.config["sFtpHost"]) {
        this.host = this.dataService.config["sFtpHost"];
      }
      this.keyWordChart = {
        color: [this.primiryColor],
        grid: {
          left: 100
        },
        legend: {
          data: ["Keywords"]
        },
        yAxis: {
          type: "category",
          name: this.t("Stopwords"),
          data: sortedKeywords.map(i => i.name)
        },
        xAxis: {
          type: "value",
          name: this.t("Hits")
        },
        series: [
          {
            name: "%",
            type: "bar",
            data: sortedKeywords.map(i => i.value),
            label: {
              normal: {
                position: "right",
                show: true
              }
            }
          }
        ]
      };
    });
  }
  getTopicClowd(param: any = {}) {
    this.filesService.getTopicCloud(param).subscribe(data => {
      this.topics = Object.keys(data.topics).map(key => {
        return {
          text: key,
          weight: data.topics[key]
        };
      });
      const sortedKeywords = Object.keys(data.topics)
        .map(key => {
          return {
            name: key,
            value: data.topics[key]
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .reverse();
      if (this.dataService.config["colors"].secondary) {
        this.primiryColor = this.dataService.config["colors"].secondary;
        this.host = this.dataService.config["sFtpHost"];
      } else {
        this.primiryColor = "#0098d9";
      }
      if (this.dataService.config["sFtpHost"]) {
        this.host = this.dataService.config["sFtpHost"];
      }
      var dataShadow = [];
      let yMax = 0;
      sortedKeywords.forEach(v => {
        if (v.value > yMax) {
          yMax = v.value;
        }
      });
      for (var i = 0; i < sortedKeywords.length; i++) {
        dataShadow.push(yMax);
      }
      this.topicChart = {
        color: [this.primiryColor],
        grid: {},
        legend: {
          data: ["Topics"]
        },
        yAxis: {
          type: "category",
          name: this.t("Topics"),
          data: sortedKeywords.map(i => i.name),
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#2a2a2a"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#2a2a2a"
            }
          }
        },
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            data: dataShadow,
            animation: false
          },
          {
            name: "%",
            type: "bar",
            data: sortedKeywords.map(i => i.value),
            label: {
              normal: {
                position: "right",
                show: false,
              }
            }
          }
        ]
      };
    });
  }
  getEchartData(param: any = { source: "audio" }) {
    this.filesService.getEchartData(param).subscribe(data => {
      if (data) {
        this.hasSankey = true;
      }
      if (data.words) {
        this.sankey1 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          lineStyle: {
            normal: {
              curveness: 0.5
            }
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: "#fbb4ae"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: "#b3cde3"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: "#ccebc5"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: "#decbe4"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            }
          ],
          color: this.colors,
          graph: {
            color: this.colors
          },
          series: {
            type: "sankey",
            data: data.words.nodes,
            links: data.words.links,
            layout: "none",
            focusNodeAdjacency: "allEdges",
            coordinateSystem: "view",
            draggable: true,
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
        };
      }
      if (data.nouns) {
        this.sankey2 = {
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
              data: data.nouns.nodes,
              links: data.nouns.links,
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
      if (data.adjs) {
        this.sankey3 = {
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
              data: data.adjs.nodes,
              links: data.adjs.links,
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
      if (data.treeRadialData && data.treeRadialData.name) {
        this.radialTreeData = data.treeRadialData;
        this.showRadialTreeData = true;
      }
      if (data.verbs) {
        this.sankey4 = {
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
              data: data.verbs.nodes,
              links: data.verbs.links,
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
      if (
        data.sentiment &&
        data.sentiment.sankeyData &&
        data.sentiment.treeRadialData
      ) {
        this.sentimentData = {
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
              data: data.sentiment.sankeyData.nodes,
              links: data.sentiment.sankeyData.links,
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
        this.sentimentTreeRadialData = {
          color: this.colors,
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          series: [
            {
              type: "tree",
              data: [data.sentiment.treeRadialData],
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
      if (data.wordsParts) {
        this.sankey5 = {
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
              data: data.wordsParts.nodes,
              links: data.wordsParts.links,
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
      if (data.wordsSent) {
        this.sankey6 = {
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
              data: data.wordsSent.nodes.map(v => ({
                ...v,
                name: this.t(v.name)
              })),
              links: data.wordsSent.links.map(v => ({
                ...v,
                target: this.t(v.target)
              })),
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
      if (data.adjsSent) {
        this.sankey7 = {
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
              data: data.adjsSent.nodes,
              links: data.adjsSent.links,
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
      if (data.popularWords) {
        this.showHitsVsStopwors = true;
        this.keywords2 = data.popularWords;
        this.freqWords = data.popularWords
          .map(item => {
            return {
              name: item.text,
              value: item.weight
            };
          })
          .sort((a, b) => b.value - a.value);
      }
    });
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    const params = {
      source: "audio"
    };
    if (changes.dateFrom.currentValue) {
      params["dateFrom"] = changes.dateFrom.currentValue;
    }
    if (changes.dateFrom.currentValue) {
      params["dateTo"] = changes.dateTo.currentValue;
    }
    if (changes.batches.currentValue) {
      params["batches"] = changes.batches.currentValue;
    }
    this.loading = true;
    this.getMinutesStats(params);
    this.getApiCallsStats(params);
    this.getFileStats(params);
    this.getTagClowd(params);
    this.getTopicClowd({});
    this.getEchartData(params);
  }

  public loadData() {}
  private getRadius(r, minR, maxR) {
    if (r === minR) {
      return 20;
    } else if (r === maxR) {
      return 40;
    } else {
      return Math.floor(20 + (40 * r) / maxR);
    }
  }
  public logout() {
    this.router.navigateByUrl("/");
  }
  public getTotal(data: any[]): number {
    return data.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        currentValue.series.reduce((acc, cur) => {
          return acc + cur.value;
        }, 0)
      );
    }, 0);
  }
  username() {
    const data = localStorage.getItem("user");
    const user = data && JSON.parse(data);
    return data && user && user.username;
  }
  public zoomOPtions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  keywordClicked(clicked: CloudData) {
    this.analyticsService.trackEvent("user", "keywordClicked");
    this.filterService.filter.keywordsContain = [
      { display: clicked.text, value: clicked.text }
    ];
    this.router.navigateByUrl("/user/files");
  }
  topicClicked(clicked: CloudData) {
    this.analyticsService.trackEvent("user", "topicClicked");
    this.filterService.filter.topics = clicked.text;
    this.router.navigateByUrl("/user/files");
  }

  t(v) {
    return LanguageService.t(v);
  }

  isEnglish() {
    return this.lang.checkLanguage("en");
  }

  isSpanish() {
    return this.lang.checkLanguage("sp");
  }
  isRussian() {
    return this.lang.checkLanguage("ru");
  }

  getColor(i) {
    return colors[i];
  }
}
