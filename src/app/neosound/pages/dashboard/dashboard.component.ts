import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CloudData } from "angular-tag-cloud-module";

import { FilesService } from "../../services/files.service";
import { comonKeywords } from "./data";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../services/language.service";

const colors = [
  "#37A2DA",
  "#32C5E9",
  "#67E0E3",
  "#9FE6B8",
  "#FFDB5C",
  "#ff9f7f",
  "#fb7293",
  "#E062AE",
  "#E690D1",
  "#e7bcf3",
  "#9d96f5",
  "#8378EA",
  "#96BFFF"
];

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  hasData: boolean = false;
  config = {};
  options: any = {};
  public users$: Observable<any>;
  public barChart: any;
  public totals = {};
  public data_2 = [];
  public keywords = [];
  public keywords2 = [];
  public loading = true;
  hasSankey = false;
  sankey1: any;
  sankey2: any;
  sankey3: any;
  sankey4: any;
  sankey5: any;
  sankey6: any;
  sankey7: any;

  constructor(
    private router: Router,
    private filesService: FilesService,
    private http: HttpClient
  ) {
    this.http.get("assets/config/config.json").subscribe((data: any) => {
      this.config = data;
    });
  }
  ngOnInit() {
    this.filesService.getFileStats({}).subscribe(data => {
      this.loading = false;
      const batches = Object.keys(data.batches);
      if (batches) {
        this.hasData = true;
        const anger = [];
        const all = [];
        const silence = [];
        batches.slice(0, 4).forEach(batchName => {
          all.push(data.batches[batchName].allCallsN);
          anger.push(data.batches[batchName].angerCallsN);
          silence.push(data.batches[batchName].silentCallsN);
        });
        const chartData = [
          {
            name: "All",
            type: "bar",
            data: all
          },
          {
            name: "Emotional",
            type: "bar",
            data: anger
          },
          {
            name: "Silence",
            type: "bar",
            data: silence
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
                data.batches[batchName].silentCallsN,
                data.batches[batchName].angerCallsN,
                data.batches[batchName].allCallsN,
                batchName
              ]
            ],
            type: "scatter",
            symbolSize: data => {
              return this.getRadius(data[2], minR, maxR);
            },
            label: {
              emphasis: {
                show: true,
                formatter: function(param) {
                  return `${param.data[3]} - Calls: ${param.data[2]}, Silent: ${
                    param.data[0]
                  }, Emotional: ${param.data[1]},`;
                },
                position: "top"
              }
            }
          };
        });
        this.barChart = {
          color: colors,
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["All", "Emotional", "Silence"]
          },
          yAxis: {
            type: "category",
            axisTick: { show: false },
            data: batches.slice(0, 4)
          },
          xAxis: {
            type: "value",
            name: "Calls",
            min: 0,
            max: Math.floor(maxR * 1.1)
          },
          series: chartData
        };
        this.totals = data.totals;
        this.options = {
          color: colors,
          backgroundColor: "#fff",
          legend: {
            type: "scroll",
            orient: "vertical",
            right: 10,
            top: 20,
            bottom: 20,
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
            name: "Silent Calls",
            nameLocation: "middle",
            nameGap: 35,
            axisLabel: {
              formatter: "{value}"
            },
            min: 0,
            max: Math.round(maxX * 1.5)
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
            name: "Emotional Calls",
            axisLabel: {
              formatter: "{value}"
            },
            min: 0,
            max: Math.round(maxY * 1.5)
          },
          series: buble
        };
      } else {
        this.hasData = false;
      }
    });
    this.filesService.getTagClowd({}).subscribe(data => {
      this.keywords2 = comonKeywords;
      this.keywords = Object.keys(data.keywords).map(key => {
        return {
          text: key,
          weight: data.keywords[key]
        };
      });
    });
    this.filesService.getEchartData({}).subscribe(data => {
      if (data) {
        this.hasSankey = true;
      }
      if (data.nouns) {
        this.sankey1 = {
          series: {
            type: "sankey",
            layout: "none",
            focusNodeAdjacency: "allEdges",
            links: [
              { source: "From USA", target: "To USA", value: 13592 },
              { source: "From CHN", target: "To CHN", value: 11107 },
              { source: "From JPN", target: "To JPN", value: 3315 },
              { source: "From USA", target: "To CHN", value: 2799 },
              { source: "From CHN", target: "To USA", value: 2509 },
              { source: "From KOR", target: "To KOR", value: 1937 },
              { source: "From FRA", target: "To FRA", value: 1899 },
              { source: "From IND", target: "To IND", value: 1439 },
              { source: "From GBR", target: "To GBR", value: 1394 },
              { source: "From DEU", target: "To DEU", value: 1178 },
              { source: "From ITA", target: "To ITA", value: 1038 },
              { source: "From USA", target: "To GBR", value: 898 },
              { source: "From GBR", target: "To USA", value: 812 },
              { source: "From USA", target: "To KOR", value: 811 },
              { source: "From ESP", target: "To ESP", value: 794 },
              { source: "From USA", target: "To IND", value: 726 },
              { source: "From DEU", target: "To USA", value: 725 },
              { source: "From JPN", target: "To USA", value: 705 },
              { source: "From USA", target: "To JPN", value: 694 },
              { source: "From KOR", target: "To USA", value: 689 },
              { source: "From CAN", target: "To USA", value: 670 },
              { source: "From IND", target: "To USA", value: 670 },
              { source: "From USA", target: "To DEU", value: 669 },
              { source: "From AUS", target: "To AUS", value: 648 },
              { source: "From USA", target: "To CAN", value: 615 },
              { source: "From CAN", target: "To CAN", value: 517 },
              { source: "From FRA", target: "To USA", value: 509 },
              { source: "From USA", target: "To FRA", value: 507 },
              { source: "From NLD", target: "To NLD", value: 446 },
              { source: "From BRA", target: "To BRA", value: 358 },
              { source: "From USA", target: "To AUS", value: 325 },
              { source: "From AUS", target: "To USA", value: 309 },
              { source: "From ITA", target: "To USA", value: 280 },
              { source: "From USA", target: "To NLD", value: 278 },
              { source: "From GBR", target: "To CHN", value: 273 },
              { source: "From ESP", target: "To USA", value: 271 },
              { source: "From ISR", target: "To USA", value: 264 },
              { source: "From USA", target: "To ESP", value: 260 },
              { source: "From USA", target: "To ITA", value: 258 },
              { source: "From NLD", target: "To USA", value: 254 }
            ],
            data: [
              { name: "From ISR" },
              { name: "To ISR" },
              { name: "From GBR" },
              { name: "To GBR" },
              { name: "From JPN" },
              { name: "To JPN" },
              { name: "From USA" },
              { name: "To USA" },
              { name: "From ESP" },
              { name: "To ESP" },
              { name: "From CAN" },
              { name: "To CAN" },
              { name: "From NLD" },
              { name: "To NLD" },
              { name: "From CHN" },
              { name: "To CHN" },
              { name: "From ITA" },
              { name: "To ITA" },
              { name: "From BRA" },
              { name: "To BRA" },
              { name: "From FRA" },
              { name: "To FRA" },
              { name: "From DEU" },
              { name: "To DEU" },
              { name: "From AUS" },
              { name: "To AUS" },
              { name: "From IND" },
              { name: "To IND" },
              { name: "From KOR" },
              { name: "To KOR" }
            ]
          }
        };
      }
      if (data.words) {
        this.sankey2 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          color: colors,
          graph: {
            color: colors
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
          color: colors,
          graph: {
            color: colors
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
      if (data.verbs) {
        this.sankey4 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          color: colors,
          graph: {
            color: colors
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
      if (data.wordsParts) {
        this.sankey5 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          color: colors,
          graph: {
            color: colors
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
          color: colors,
          graph: {
            color: colors
          },
          series: [
            {
              type: "sankey",
              data: data.wordsSent.nodes,
              links: data.wordsSent.links,
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
          color: colors,
          graph: {
            color: colors
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
    });
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
    this.filesService.setKeyWord(clicked.text);
    this.router.navigateByUrl('/user/files');
  }

  t(v) {
    return LanguageService.t(v);
  }
}
