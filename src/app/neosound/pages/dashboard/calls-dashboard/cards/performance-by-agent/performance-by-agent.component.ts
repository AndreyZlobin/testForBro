import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";

@Component({
  selector: "ngx-performance-by-agent",
  templateUrl: "./performance-by-agent.component.html"
})
export class PerformanceByAgentComponent implements OnInit, OnDestroy {
  options: any = 0;
  angercallscount: any = 0;
  silentcallscount: any = 0;
  dataSub1: any;
  dataSub2: any;
  dataSub3: any;
  hasData: boolean = false;
  constructor(
    private dataService: DashboardFileStatsService,
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.batches) {
        this.options = this.getOptions(data);
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
  }
  ngOnInit() {}
  ngOnDestroy() {
    if (this.dataSub1) {
      this.dataSub1.unsubscribe();
    }
    if (this.dataSub2) {
      this.dataSub2.unsubscribe();
    }
    if (this.dataSub3) {
      this.dataSub3.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  colors = [
    "#c12e34",
    "#0098d9",
    "#e6b600",
    "#2b821d",
    "#005eaa",
    "#339ca8",
    "#cda819",
    "#32a487"
  ];
  getOptions(data: any): any {
    let options = {};
    const batches = Object.keys(data.batches);
    if (batches) {
      this.hasData = true;
      const anger = [];
      const all = [];
      const silence = [];
      batches
        .sort((a, b) => data.batches[b].allCallsN - data.batches[a].allCallsN)
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

      options = {
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
          max: Math.ceil((maxX / maxR) * 140)
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
          max: Math.ceil((maxY / maxR) * 140)
        },
        tooltip: {
          show: true,
          formatter: function(param) {
            return `${param.data[3]}<br>Calls: ${param.data[2]}<br> Silent: ${param.data[4]}<br> Emotional: ${param.data[5]}`;
          }
        },
        series: buble
      };
    }
    return options;
  }
  private getRadius(r, minR, maxR) {
    if (r === minR) {
      return 20;
    } else if (r === maxR) {
      return 40;
    } else {
      return Math.floor(20 + (40 * r) / maxR);
    }
  }
}