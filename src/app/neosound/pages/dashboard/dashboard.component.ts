import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, TimeoutError } from "rxjs";

import { FilesService } from "../../services/files.service";
import { comonKeywords } from "./data";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../services/language.service";

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
  colors: [
    "#009AD2",
    "#E36B68",
    "#00A576",
    "#8661B3",
    "#9C4995",
    "#A72F71",
    "#E86765",
    "#EB9A28",
    "#EB9A28",
    "#F9F871",
    "#6677C7"
  ];

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
            name: "Emotional",
            type: "bar",
            data: anger
          },
          {
            name: "Silence",
            type: "bar",
            data: silence
          },
          {
            name: "All",
            type: "bar",
            data: all
          }
        ];
        this.barChart = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: [ "Emotional", "Silence", "All"]
          },
          yAxis: {
            type: "category",
            axisTick: { show: false },
            data: batches.slice(0, 4)
          },
          xAxis: {
            type: "value",
            name: "Calls"
          },
          series: chartData
        };
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
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: "rgba(120, 36, 50, 0.5)",
                shadowOffsetY: 5,
                color: this.colors
              }
            }
          };
        });
        this.totals = data.totals;
        this.options = {
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
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
          },
          series: [
            {
              type: "sankey",
              data: data.words.nodes,
              links: data.words.links,
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
      if (data.words) {
        this.sankey2 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
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
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
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
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
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
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
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
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
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
          color: [
            "#c12e34",
            "#e6b600",
            "#0098d9",
            "#2b821d",
            "#005eaa",
            "#339ca8",
            "#cda819",
            "#32a487"
          ],
          graph: {
            color: [
              "#c12e34",
              "#e6b600",
              "#0098d9",
              "#2b821d",
              "#005eaa",
              "#339ca8",
              "#cda819",
              "#32a487"
            ]
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

  t(v) {
    return LanguageService.t(v);
  }
}
