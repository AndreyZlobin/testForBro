import { Component, OnInit, Input } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { LanguageService } from '../../../services/language.service';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'ngx-total-minutes-by-day-chart-line',
  templateUrl: './total-minutes-by-day-chart-line.component.html',
  styleUrls: ['./total-minutes-by-day-chart-line.component.scss']
})
export class TotalMinutesByDayChartLineComponent implements OnInit {

  option4: any = {};
  echartsInstance4;

  isLoading = true;
  fileStatLoaded = false;
  minutesStatLoaded = false;
  apiStatLoaded = false;

  fileStat: any = {};
  minutesStat: any = {};
  apiStat: any = {};

  config = {};
  colors = [];

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

  constructor(
    private filesService: FilesService,
    private http: HttpClient,
  ) {  }

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
    this.setMinutesPerDay();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setMinutesPerDay() {
    const series = [];
    this.minutesStat.totals && this.minutesStat.totals.durdata && this.minutesStat.totals.durdata.series.map(v => {
        series.push({
            name: 'Name',
            type: 'line',
            stack: 'stack',
            areaStyle: {},
            data: v,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
        });
    });
    this.minutesStat.totals
        && this.minutesStat.totals.legenddata.map((v, i) => {
        series[i].name = v;
    });

    this.option4 = {
      // color: [this.colors[0], this.colors[6], this.colors[1]],
      color: this.colors,
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
          data: this.minutesStat.totals && this.minutesStat.totals.legenddata || []
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
              data : this.minutesStat.totals && this.minutesStat.totals.dates || []
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

  onChartInit4(ec) {
    this.echartsInstance4 = ec;
  }

}
