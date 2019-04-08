import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, TimeoutError } from "rxjs";

import { FilesService } from "../../services/files.service";
import { comonKeywords } from "./data";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  options: any = {};
  public users$: Observable<any>;
  public barches = [];
  public totals = {};
  public data_2 = [];
  public keywords = [];
  public keywords2 = [];
  public loading = true;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = "Legend";
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = "Operator";
  showYAxisLabel = false;
  yAxisLabel = "Number Of Calls";
  showGridLines = true;
  innerPadding = "10%";
  barPadding = 8;
  groupPadding = 16;
  roundDomains = true;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: false;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = false;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;
  legendPosition = "left";
  colorScheme = {
    name: "custom",
    selectable: true,
    group: "custom",
    domain: [
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
    ]
  };

  constructor(private router: Router, private filesService: FilesService) {}
  ngOnInit() {
    this.filesService.getFileStats({}).subscribe(data => {
      this.loading = false;
      const batches = Object.keys(data.batches).slice(0, 4);
      if (batches) {
        const chartData = batches.map(batchName => {
          return {
            name: batchName,
            series: [
              {
                name: "All Calls",
                value: data.batches[batchName].allCallsN
              },
              {
                name: "Anger Calls",
                value: data.batches[batchName].angerCallsN
              },
              {
                name: "Silent Calls",
                value: data.batches[batchName].silentCallsN
              }
            ]
          };
        });
        const buble1 = [];
        const buble2 = [];
        const buble3 = [];
        const buble = batches.map((batchName, index) => {
          return {
            name: batchName,
            data: [
              data.batches[batchName].angerCallsN,
              data.batches[batchName].silentCallsN,
              data.batches[batchName].allCallsN,
              batchName,
              batchName
            ],
            type: "scatter",
            symbolSize: function(data) {
              return data / 5;
            },
            label: {
              emphasis: {
                show: true,
                formatter: function(param) {
                  return param.data[3];
                },
                position: "top"
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: "rgba(120, 36, 50, 0.5)",
                shadowOffsetY: 5,
                color: this.colorScheme.domain[index]
              }
            }
          };
        });

        this.barches = chartData;
        this.totals = data.totals;
        this.options = {
          backgroundColor: "#fff",
          legend: {
            right: 10,
            data: batches
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            scale: true
          },
          series: buble
        };
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
  }

  public loadData() {}

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
    const data = localStorage.getItem('user');
    const user = data && JSON.parse(data);
    return data && user && user.username;
  }
}
