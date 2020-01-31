import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-average-sentiments",
  templateUrl: "./average-sentiments.component.html"
})
export class AverageSentimentsComponent implements OnInit, OnDestroy {
  @Output() onClickBatch = new EventEmitter<string>();
  @Output() onClickTrend = new EventEmitter<string>();
  textColors = {
    "Positive-Positive": "text-success",
    "Positive-Negative": "text-danger",
    "Positive-Neutral": "text-info",
    "Negative-Positive": "text-success",
    "Negative-Negative": "text-danger",
    "Negative-Neutral": "text-info",
    "Neutral-Positive": "text-success",
    "Neutral-Negative": "text-danger",
    "Neutral-Neutral": "text-info"
  };
  sentiments: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  constructor(
    private dataService: DashboardFileStatsService,
    private userData: DataService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.batches) {
        this.sentiments = Object.keys(data.batches).map((batch, index) => {
          return {
            name: batch,
            "Positive-Positive":
              data.batches[batch].sentimentTrendCount["Positive-Positive"],
            "Positive-Negative":
              data.batches[batch].sentimentTrendCount["Positive-Negative"],
            "Positive-Neutral":
              data.batches[batch].sentimentTrendCount["Positive-Neutral"],
            "Negative-Positive":
              data.batches[batch].sentimentTrendCount["Negative-Positive"],
            "Negative-Negative":
              data.batches[batch].sentimentTrendCount["Negative-Negative"],
            "Negative-Neutral":
              data.batches[batch].sentimentTrendCount["Negative-Neutral"],
            "Neutral-Positive":
              data.batches[batch].sentimentTrendCount["Neutral-Positive"],
            "Neutral-Negative":
              data.batches[batch].sentimentTrendCount["Neutral-Negative"],
            "Neutral-Neutral":
              data.batches[batch].sentimentTrendCount["Neutral-Neutral"]
          };
        });
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
  onChartEvent(batchId: string) {
    this.onClickBatch.emit(batchId);
  }
  onValueClick(batchId: string, trend: string) {
    this.onClickTrend.emit(trend);
  }
  isMax(sentiment: any, type: string) {
    const vals = Object.values(sentiment) as any;
    return (
      Math.max(
        vals[1],
        vals[2],
        vals[3],
        vals[4],
        vals[5],
        vals[6],
        vals[7],
        vals[8],
        vals[9]
      ) === sentiment[type]
    );
  }
  isMaxValue(sentiment: any[]) {
    return false;
  }
  getClass(name: string, sentiments: any[]) {
    const className = this.textColors[name];
    return this.isMax(sentiments, name) ? className : "";
  }
  getClassBatch(sentiments: any[]) {
    const vlues = Object.values(sentiments);
    const vals = [
      vlues[1],
      vlues[2],
      vlues[3],
      vlues[4],
      vlues[5],
      vlues[6],
      vlues[7],
      vlues[8],
      vlues[9]
    ];
    let i = vals.indexOf(Math.max(...vals));
    return this.textColors[Object.keys(this.textColors)[i]];
  }
}
