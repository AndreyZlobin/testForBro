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
  selector: "ngx-sentimental-calls-by-day",
  templateUrl: "./sentimental-calls-by-day.component.html"
})
export class SentimentalCallsByDayComponent implements OnInit, OnDestroy {
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
      if (data) {
        this.init(data);
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
    const series =
      (data.totals && data.totals.sentimentCountData && data.totals.sentimentCountData.series) ||
      [];
    const legenddata = (data.totals && data.totals.sentimentLegendData) || [];
    this.stats = {
      color: ["#c12e34", "#0098d9", "#e6b600"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      grid: {
        left: "2%",
        right: "2%",
        bottom: false,
        containLabel: true
      },
      legend: {
        data: [legenddata[1], legenddata[2], legenddata[3], legenddata[0]]
      },
      xAxis: {
        type: "category",
        data: (data.totals && data.totals.dates) || []
      },
      yAxis: {
        type: "value",
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      series: [
        {
          name: legenddata[1] || "",
          data: series[1] || [],
          type: "line",
          smooth: true
        },
        {
          name: legenddata[2] || "",
          data: series[2] || [],
          type: "line",
          smooth: true
        },
        {
          name: legenddata[3] || "",
          data: series[3] || [],
          type: "line",
          smooth: true
        },
        {
          name: legenddata[0] || "",
          data: series[0] || [],
          type: "line",
          smooth: true,
          label: {
            normal: {
              show: true,
              position: "top"
            }
          }
        },
      ]
    };
  }
}
