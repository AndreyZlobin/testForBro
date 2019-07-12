import { Component, OnInit, Input } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { LanguageService } from '../../../services/language.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'ngx-calls-by-day-chart-line',
  templateUrl: './calls-by-day-chart-line.component.html',
  styleUrls: ['./calls-by-day-chart-line.component.scss']
})
export class CallsByDayChartLineComponent implements OnInit {
  option2: any = {};
  echartsInstance2;

  isLoading = true;
  fileStatLoaded = false;
  minutesStatLoaded = false;
  apiStatLoaded = false;

  fileStat: any = {};
  minutesStat: any = {};
  apiStat: any = {};

  config = {};
  colors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a", "#6e7074", "#546570", "#c4ccd3"];

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
    this.setLine1();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setLine1() {
    const series = this.fileStat.totals && this.fileStat.totals.countdata
        && this.fileStat.totals.countdata.series || [];
    const legenddata = this.fileStat.totals && this.fileStat.totals.legenddata || [];
    // this.fileStat.totals && this.fileStat.totals.countdata && this.fileStat.totals.countdata.series.map(v => {
    //     series.push({
    //         data: v,
    //         type: 'line',
    //         smooth: true,
    //     });
    // });
    this.option2 = {
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
          data: this.fileStat.totals && this.fileStat.totals.dates || [],
      },
      yAxis: {
          type: 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          }
      },
      series: [
        {
          name: legenddata[0] || '',
          data: series[0] || [],
          type: 'line',
          smooth: true,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
        },
        {
          name: legenddata[1] || '',
          data: series[1] || [],
          type: 'line',
          smooth: true
        },
        {
          name: legenddata[2] || '',
          data: series[2] || [],
          type: 'line',
          smooth: true
        }
      ],
    };
  }

  onChartInit2(ec) {
    this.echartsInstance2 = ec;
  }

}
