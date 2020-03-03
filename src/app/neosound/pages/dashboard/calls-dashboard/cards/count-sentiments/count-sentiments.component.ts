import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy,
  EventEmitter,
  Output
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-count-sentiments",
  templateUrl: "./count-sentiments.component.html"
})
export class CountSentimentsComponent implements OnInit, OnDestroy {
  @Output() onClick = new EventEmitter<string>();
  sentimentsChart: any = 0;
  sentiments: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
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
  constructor(
    private dataService: DashboardFileStatsService,
    private userData: DataService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.totals && data.totals.sentimentTrendCount) {
        const legend = Object.keys(data.totals.sentimentTrendCount);
        const series = legend.map(key => {
          return {
            name: key,
            value: data.totals.sentimentTrendCount[key]
          };
        });
        this.sentimentsChart = this.initChart(legend, series);
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
  initChart(legendData, seriesData) {
    return {
      color: this.colors,
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 10,
        top: 20,
        bottom: 20,
        data: legendData
      },
      series: [
        {
          name: "Sentiments",
          type: "pie",
          radius: "55%",
          center: ["40%", "50%"],
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }
  onChartEvent($event) {
    this.onClick.emit($event.name);
  }
}
