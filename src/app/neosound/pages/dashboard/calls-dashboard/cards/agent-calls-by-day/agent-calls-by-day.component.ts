import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoTagCloudService} from "../../services/auto-tag-cloud.service";
import {LanguageService} from "../../../../../services/language.service";
import {DashboardFileStatsService} from "../../services/file-stats.service";

@Component({
  selector: 'ngx-agent-calls-by-day',
  templateUrl: './agent-calls-by-day.component.html'
})
export class AgentCallsByDayComponent implements OnInit, OnDestroy {
  stats: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: DashboardFileStatsService
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
    '#c12e34',
    '#0098d9',
    '#e6b600',
    '#2b821d',
    '#005eaa',
    '#339ca8',
    '#cda819',
    '#32a487'
  ];
  init(data) {
    const series = data.totals.batchSeries || [];
    const legenddata = data.totals.batchesnames || [];
    const series_prep = [];
    for (let i = 0; i < legenddata.length; i++) {
      series_prep.push({
        name: legenddata[i] || '',
        data: series[i] || [],
        type: 'line',
        smooth: true
      })
    }
    this.stats = {
      color: this.colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: false,
        containLabel: true
      },
      legend: {
        data: legenddata
      },
      xAxis: {
        type: 'category',
        data: data.totals.dates || []
      },
      yAxis: {
        type: 'value',
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
      series: series_prep
    };
  }
}
