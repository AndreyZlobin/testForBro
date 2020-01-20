import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-number-of-calls",
  templateUrl: "./number-of-calls.component.html"
})
export class NumberOfCallsComponent implements OnInit, OnDestroy {
  stats: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: DashboardFileStatsService,
    private userData: DataService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.batches) {
        this.stats = this.init(data);
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
  }
  t(v) {
    return LanguageService.t(v);
  }
  private colors = [
    "#c12e34",
    "#0098d9",
    "#e6b600",
    "#2b821d",
    "#005eaa",
    "#339ca8",
    "#cda819",
    "#32a487"
  ];
  init(data) {
    const batches = Object.keys(data.batches);
    const anger = [];
    const all = [];
    const silence = [];
    let maxR = 0;
    batches.map((batchName, index) => {
      if (maxR < data.batches[batchName].allCallsN) {
        maxR = data.batches[batchName].allCallsN;
      }
    });
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
    return {
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
        data: batches.slice(0, 6).reverse(),
        axisLabel: {
          inside: true,
          textStyle: {
            color: "#2a2a2a"
          }
        },
        axisLine: {
          show: false
        },
        z: 10
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
  }
}
