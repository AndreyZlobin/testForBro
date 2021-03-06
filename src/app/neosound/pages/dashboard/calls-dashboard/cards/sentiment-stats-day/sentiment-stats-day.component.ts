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
  selector: "ngx-sentiment-stats-day",
  templateUrl: "./sentiment-stats-day.component.html"
})
export class SentimentStatsDayComponent implements OnInit, OnDestroy {
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
      if (data && data.totals) {
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
    const series = [];
    data.totals && data.totals.sentimentAvgData && data.totals.sentimentAvgData.series.map(v => {
        series.push({
            name: 'Name',
            type: 'line',
            stack: 'stack',
            areaStyle: {},
            data: v,
            label: {
              normal: {
                show: false,
                position: 'top'
              }
            }
        });
    });
    data.totals
        && data.totals.sentimentLegendData.map((v, i) => {
        series[i].name = this.t(v);
    });

    this.stats = {
      color: ['#e6b600', '#c12e34', '#0098d9',  "#2b821d"],
      tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      legend: {
          data: data.totals && data.totals.sentimentLegendData.map(v => this.t(v)) || []
      },
      grid: {
          left: '2%',
          right: '2%',
          bottom: false,
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : true,
              data : data.totals && data.totals.dates || []
          }
      ],
      yAxis : [
        {
          type : 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          }
        }
      ],
      series : series
    };
  }
}
