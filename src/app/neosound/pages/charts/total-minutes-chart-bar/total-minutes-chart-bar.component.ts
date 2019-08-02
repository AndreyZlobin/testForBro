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
  colors = ['#c12e34', '#0098d9', '#e6b600','#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487']; //shine

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
    this.setMinutesCalm();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setMinutesCalm() {
    const maxrows = 6;
    let rawdata = this.minutesStat.totals && this.minutesStat.totals.batchesdurdata || [];
    const rawbatches = this.minutesStat.totals && this.minutesStat.totals.batchesnames || [];
    let sortedbatches = [];

    if (rawbatches.length > maxrows) {
      const sorteddata = Array.apply(null, {length: rawdata[0].length}).map(Number.call, Number)
        .sort((a, b) => rawdata[0][b] + rawdata[1][b] + rawdata[2][b] - rawdata[0][a] - rawdata[1][a] - rawdata[2][a])
        .slice(0, maxrows)
        .reverse();
      rawdata = rawdata.map(x => {const arr = []; sorteddata.forEach(i => arr.push(x[i])); return arr;});
      sorteddata.forEach(i => sortedbatches.push(rawbatches[i]));
    } else {
      sortedbatches = rawbatches;
    }

    const legendData = this.minutesStat.totals && this.minutesStat.totals.legenddata || [];
    const y_data = sortedbatches;
    const _data = rawdata;
    const _label = {
      normal: {
        show: false,
        position: 'inside'
      }
    };
    const minX = Math.min(..._data[0]) < 1 ? -0.5 : 0;
    this.option7 = {
      // color: [this.colors[0], this.colors[6], this.colors[1]],
      color: this.colors,
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
