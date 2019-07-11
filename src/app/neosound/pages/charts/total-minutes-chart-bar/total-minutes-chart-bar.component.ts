import { Component, OnInit, Input } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { LanguageService } from '../../../services/language.service';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'ngx-total-minutes-chart-bar',
  templateUrl: './total-minutes-chart-bar.component.html',
  styleUrls: ['./total-minutes-chart-bar.component.scss']
})
export class TotalMinutesChartBarComponent implements OnInit {

  option7: any = {};
  echartsInstance7;

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
    this.setMinutesCalm();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setMinutesCalm() {
    const legendData = this.minutesStat.totals && this.minutesStat.totals.legenddata || [];
    const y_data = this.minutesStat.totals && this.minutesStat.totals.batchesnames || [];
    const _data = this.minutesStat.totals && this.minutesStat.totals.batchesdurdata || [];
    const _label = {
      normal: {
        show: true,
        position: 'inside'
      }
    };
    const minX = Math.min(..._data[0]) < 1 ? -0.5 : 0;
    this.option7 = {
      // color: [this.colors[0], this.colors[6], this.colors[1]],
        legend: {
            data: legendData
        },
        grid: {
          containLabel: true,
          left: '5%',
          // right: '5%',
          bottom: 30
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
            min: minX,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
        },
        yAxis: [{
          data: y_data,
          axisLabel: {
            show: true
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }],
        series: [{
          type: 'bar',
          name: legendData[0],
          stack: '2',
          label: _label,
          barWidth: 40,
          data: _data[0]
        }, {
          type: 'bar',
          name: legendData[1],
          stack: '2',
          barWidth: 40,
          label: _label,
          data: _data[1]
        }, {
          type: 'bar',
          stack: '2',
          name: legendData[2],
          barWidth: 40,
          label: _label,
          data: _data[2]
        }]
    };
  }

  onChartInit7(ec) {
    this.echartsInstance7 = ec;
  }
}
