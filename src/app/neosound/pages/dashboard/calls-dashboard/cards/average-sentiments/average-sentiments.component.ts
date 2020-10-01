import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-average-sentiments",
  templateUrl: "./average-sentiments.component.html",
})
export class AverageSentimentsComponent implements OnInit, OnDestroy {
  @Output() onClickBatch = new EventEmitter<any>();
  @Output() onClickTrend = new EventEmitter<any>();
  option = {
    animation: true,
    tooltip: {
      position: "top",
    },
    xAxis: {
      type: "category",
      data: null,
      splitArea: {
        show: true,
      },
      triggerEvent: true,
    },
    yAxis: {
      type: "category",
      data: null,
      splitArea: {
        show: true,
      },
      triggerEvent: true,
    },
    series: null,
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "0%",
      inRange: {
        color: ["#ffffff", "#0098d9"], //From smaller to bigger value ->
      },
    },
    grid: {
      height: "80%",
      top: "0%",
    },
  };
  sentiments: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  constructor(
    private dataService: DashboardFileStatsService,
    private userData: DataService
  ) {
    this.dataSub1 = this.dataService.data.subscribe((data) => {
      if (data && data.batches) {
        const sentiments = [];
        Object.keys(data.batches).forEach((batch, index) => {
          sentiments.push([
            "Positive-Positive",
            batch,
            data.batches[batch].sentimentTrendCount["Positive-Positive"],
          ]);
          sentiments.push([
            "Positive-Negative",
            batch,
            data.batches[batch].sentimentTrendCount["Positive-Negative"],
          ]);
          sentiments.push([
            "Positive-Neutral",
            batch,
            data.batches[batch].sentimentTrendCount["Positive-Neutral"],
          ]);
          sentiments.push([
            "Negative-Positive",
            batch,
            data.batches[batch].sentimentTrendCount["Negative-Positive"],
          ]);
          sentiments.push([
            "Negative-Negative",
            batch,
            data.batches[batch].sentimentTrendCount["Negative-Negative"],
          ]);
          sentiments.push([
            "Negative-Neutral",
            batch,
            data.batches[batch].sentimentTrendCount["Negative-Neutral"],
          ]);
          sentiments.push([
            "Neutral-Positive",
            batch,
            data.batches[batch].sentimentTrendCount["Neutral-Positive"],
          ]);
          sentiments.push([
            "Neutral-Negative",
            batch,
            data.batches[batch].sentimentTrendCount["Neutral-Negative"],
          ]);
          sentiments.push([
            "Neutral-Neutral",
            batch,
            data.batches[batch].sentimentTrendCount["Neutral-Neutral"],
          ]);
        });
        const max = sentiments
          .map((i) => i[2])
          .reduce(function (a, b) {
            return Math.max(a, b);
          });

        this.option.yAxis.data = Object.keys(data.batches);
        this.option.visualMap.max = max;
        this.option.xAxis.data = [
          "Positive-Positive",
          "Positive-Negative",
          "Positive-Neutral",
          "Negative-Positive",
          "Negative-Negative",
          "Negative-Neutral",
          "Neutral-Positive",
          "Neutral-Negative",
          "Neutral-Neutral",
        ];
        this.option.series = [
          {
            type: "heatmap",
            data: sentiments,
            label: {
              show: true,
              color: "#005eaa",
            },
            itemStyle: {
              color: "#000",
            },
          },
        ];
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
  onChartEvent(event: any) {
    if (event.componentType === "yAxis") {
      this.onClickTrend.emit({ batchId: event.value});
    }
    if (event.componentType === "xAxis") {
      this.onClickTrend.emit({ trend: event.value});
    }
    if (event.componentType === "series") {
      this.onClickTrend.emit({ batchId: event.data[1], trend: event.data[0] });
    }
  }
}
