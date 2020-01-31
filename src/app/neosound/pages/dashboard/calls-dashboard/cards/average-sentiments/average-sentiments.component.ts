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
  @Output() onClick = new EventEmitter<string>();
  sentiments: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
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
      if (data && data.batches) {
        this.sentiments = Object.keys(data.batches).map(
          (batch, index) => {
            return {
              name: batch,
              Negative: data.batches[batch].sentimentCount.Negative,
              Neutral: data.batches[batch].sentimentCount.Neutral,
              Positive: data.batches[batch].sentimentCount.Positive,
              notAvalable: data.batches[batch].sentimentCount["n/a"]
            };
          }
        );
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
    this.onClick.emit(batchId);
  }
  isMax(sentiment: any, type: string) {
    const vals = Object.values(sentiment) as any;
    return Math.max(vals[1], vals[2], vals[3], vals[4]) === sentiment[type];
  }
}
