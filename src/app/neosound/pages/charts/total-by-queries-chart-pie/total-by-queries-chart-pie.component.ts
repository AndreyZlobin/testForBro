import {Component, Input, OnInit} from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { LanguageService } from '../../../services/language.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'ngx-total-by-queries-chart-pie',
  templateUrl: './total-by-queries-chart-pie.component.html',
  styleUrls: ['./total-by-queries-chart-pie.component.scss']
})
export class TotalByQueriesChartPieComponent implements OnInit {
  option5: any = {};
  echartsInstance5;

  isLoading = true;
  fileStatLoaded = false;
  minutesStatLoaded = false;
  apiStatLoaded = false;

  fileStat: any = {};
  minutesStat: any = {};
  apiStat: any = {};

  config = {};
  colors = ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487']; //shine

  @Input() set fileStatData(data) {
    this.fileStat = data;
    this.fileStatLoaded = true;
    this.init();
  }
  @Input() set minutesStatData(data) {
    this.minutesStat = data;
    this.minutesStatLoaded = true;
    this.init();
  }
  @Input() set apiStatData(data) {
    this.apiStat = data;
    this.apiStatLoaded = true;
    this.init();
  }
  @Input() set colorsData(data) {
    this.colors = data;
    this.init();
  }

  constructor() { }

  ngOnInit() {
  }

  init() {
    if (!this.fileStatLoaded || !this.minutesStatLoaded || !this.apiStatLoaded) {
      return;
    }
    this.isLoading = false;
    this.initChart();
  }

  initChart() {
    this.setTotalQueries();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setTotalQueries() {
    const legenddata = this.apiStat.data.legend || [];
    const seriesdata = this.apiStat.data.series || [];
    this.option5 = {
      color: this.colors,
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        show: false,
        x : 'center',
        y : 'bottom',
        data: legenddata
      },
      calculable : true,
      series : [
        {
          name: 'API Calls',
          type: 'pie',
          radius : [80, 130],
          selectedMode: 'multiple',
          // center: ['50%', '40%'],
          data: seriesdata
        }
      ]
    };
  }

  onChartInit5(ec) {
    this.echartsInstance5 = ec;
  }


}
