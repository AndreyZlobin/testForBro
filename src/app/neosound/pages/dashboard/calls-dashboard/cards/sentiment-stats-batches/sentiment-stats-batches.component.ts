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
  selector: "ngx-sentiment-stats-batches",
  templateUrl: "./sentiment-stats-batches.component.html"
})
export class SentimentStatsBatchesComponent implements OnInit, OnDestroy {
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
      if (data && data.totals && data.batches) {
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
    const maxrows = 6;
    let rawdata = (data.totals && data.totals.sentimentAvgDataBatches) || [];
    const rawbatches = data.totals.batchesnames || [];
    let sortedbatches = [];

    if (rawbatches.length > maxrows) {
      const sorteddata = Array.apply(null, { length: rawdata[0].length })
        .map(Number.call, Number)
        .sort(
          (a, b) =>
            rawdata[0][b] +
            rawdata[1][b] +
            rawdata[2][b] -
            rawdata[0][a] -
            rawdata[1][a] -
            rawdata[2][a]
        )
        .slice(0, maxrows)
        .reverse();
      rawdata = rawdata.map(x => {
        const arr = [];
        sorteddata.forEach(i => arr.push(x[i]));
        return arr;
      });
      sorteddata.forEach(i => sortedbatches.push(rawbatches[i]));
    } else {
      sortedbatches = rawbatches;
    }

    const legendData = (data.totals && data.totals.sentimentLegendData) || [];
    const y_data = sortedbatches;
    const _data = rawdata;
    // const minX = Math.min(..._data[0]) < 1 ? -0.5 : 0;
    const total_y_data = ["All batches"];
    const batches_len = Math.max(...y_data.map(x => x.length));
    const y_label_len = total_y_data[0].length;
    const max_len = Math.round(Math.max(batches_len, y_label_len) * 1.1);
    const max_width = 100 - Math.round(max_len * 0.8);
    // const total_data = _data.map(x => Math.round(x.reduce((a, b) => a + b, 0) * 100) / 100);

    const total_data = Object.keys(data.totals.sentimentAvg).map(
      key => data.totals.sentimentAvg[key]
    );
    const ylabel = function(v) {
      return v.value / Math.max(...total_data) < 0.05 ? "" : v.value;
    };
    const ylabele = function(v) {
      return v.value;
    };
    const _label = {
      normal: {
        show: false,
        position: "inside"
      },
      emphasis: {
        show: true,
        position: "inside"
      }
    };
    const total_label = {
      normal: {
        show: true,
        position: "inside",
        formatter: ylabel
      },
      emphasis: {
        show: true,
        position: "inside",
        formatter: ylabele
      }
    };

    const series = [
      {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: "bar",
        name: legendData[0],
        stack: "2",
        label: _label,
        barWidth: 30,
        data: _data[0]
      },
      {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: "bar",
        name: legendData[1],
        stack: "2",
        barWidth: 30,
        label: _label,
        data: _data[1]
      },
      {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: "bar",
        stack: "2",
        name: legendData[2],
        barWidth: 30,
        label: _label,
        data: _data[2]
      },
      {
        yAxisIndex: 0,
        xAxisIndex: 0,
        type: "bar",
        stack: "2",
        name: legendData[3],
        barWidth: 30,
        label: _label,
        data: _data[3]
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: data.totals && data.totals.sentimentLegendData[0],
        type: "bar",
        stack: "stack",
        barWidth: 30,
        label: total_label,
        data: [total_data[0]]
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: data.totals && data.totals.sentimentLegendData[1],
        type: "bar",
        stack: "stack",
        barWidth: 30,
        label: total_label,
        data: [total_data[1]]
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: data.totals && data.totals.sentimentLegendData[2],
        type: "bar",
        stack: "stack",
        barWidth: 30,
        label: total_label,
        data: [total_data[2]]
      },
      {
        yAxisIndex: 1,
        xAxisIndex: 1,
        name: data.totals && data.totals.sentimentLegendData[3],
        type: "bar",
        stack: "stack",
        barWidth: 30,
        label: total_label,
        data: [total_data[3]]
      }
    ];

    this.stats = {
      color: ["#c12e34", "#e6b600", "#0098d9", "#2b821d"],
      legend: {
        data: legendData
      },
      grid: [
        {
          show: false,
          width: max_width + "%",
          top: "4%",
          left: max_len + "%",
          bottom: "15%"
        },
        {
          show: false,
          width: max_width + "%",
          left: max_len + "%",
          top: "90%",
          bottom: "0%"
        }
      ],
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow"
        }
      },
      xAxis: [
        {
          gridIndex: 0,
          // min: minX,
          axisLabel: {
            show: false
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
            show: false
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
      yAxis: [
        {
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
        }
      ],
      series: series
    };
  }
}
