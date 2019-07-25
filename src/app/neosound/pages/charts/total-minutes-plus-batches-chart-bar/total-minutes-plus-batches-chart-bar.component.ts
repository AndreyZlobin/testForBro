import { Component, OnInit, Input } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'ngx-total-minutes-plus-batches-chart-bar',
  templateUrl: './total-minutes-plus-batches-chart-bar.component.html',
  styleUrls: ['./total-minutes-plus-batches-chart-bar.component.scss']
})
export class TotalMinutesPlusBatchesChartBarComponent implements OnInit {

  option8: any = {};
  echartsInstance8;

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
    this.setTotalMinutesBatches();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setTotalMinutesBatches() {
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
    // const minX = Math.min(..._data[0]) < 1 ? -0.5 : 0;
    const total_y_data = ['All batches'];
    const batches_len = Math.max(...y_data.map(x => x.length));
    const y_label_len = total_y_data[0].length;
    const max_len = Math.round(Math.max(batches_len, y_label_len) * 1.1);
    const max_width = 100 - Math.round(max_len * 0.8);
    // const total_data = _data.map(x => Math.round(x.reduce((a, b) => a + b, 0) * 100) / 100);

    const total_data = [
      this.minutesStat.totals && this.minutesStat.totals.angerdur,
      this.minutesStat.totals && this.minutesStat.totals.calmdur,
      this.minutesStat.totals && this.minutesStat.totals.silentdur
    ];
    const ylabel = function(v) {
      return (v.value/Math.max(...total_data) < 0.05) ? '' : v.value
    };
    const ylabele = function(v) {
      return v.value
    };
    const _label = {
      normal: {
        show: false,
        position: 'inside'
      },
      emphasis: {
        show: true,
        position: 'inside'
      }
    };
    const total_label = {
      normal: {
        show: true,
        position: 'inside',
        formatter: ylabel
      },
      emphasis: {
        show: true,
        position: 'inside',
        formatter: ylabele
      }
    };

    const series = [
      {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: 'bar',
        name: legendData[0],
        stack: '2',
        label: _label,
        barWidth: 30,
        data: _data[0]
      }, {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: 'bar',
        name: legendData[1],
        stack: '2',
        barWidth: 30,
        label: _label,
        data: _data[1]
      }, {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: 'bar',
        stack: '2',
        name: legendData[2],
        barWidth: 30,
        label: _label,
        data: _data[2]
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: this.minutesStat.totals && this.minutesStat.totals.legenddata[0],
        type: 'bar',
        stack: 'stack',
        barWidth: 30,
        label: total_label,
        data: [total_data[0]],
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: this.minutesStat.totals && this.minutesStat.totals.legenddata[1],
        type: 'bar',
        stack: 'stack',
        barWidth: 30,
        label: total_label,
        data: [total_data[1]],
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: this.minutesStat.totals && this.minutesStat.totals.legenddata[2],
        type: 'bar',
        stack: 'stack',
        barWidth: 30,
        label: total_label,
        data: [total_data[2]],
      }
    ];

    this.option8 = {
      color: this.colors,
      // color: [this.colors[0], this.colors[6], this.colors[1]],
      //   backgroundColor: '#ffffff',
      legend: {
        data: legendData,
      },
      grid: [{
        show: false,
        width: max_width + '%',
        top: '4%',
        left: max_len + '%',
        bottom: '15%'
      }, {
        show: false,
        width: max_width + '%',
        left: max_len + '%',
        top: '90%',
        bottom: '0%'
      }],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: [{
        gridIndex: 0,
        // min: minX,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }

      },
        {
          gridIndex: 1,
          // min: minX * 2,
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

        }
      ],
      yAxis: [{
        gridIndex: 0,
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
      },
        {
          gridIndex: 1,
          data: total_y_data,
          axisLabel: {
            show: true,
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
        }
      ],
      series: series,
    };
  }

  onChartInit8(ec) {
    this.echartsInstance8 = ec;
  }

}
