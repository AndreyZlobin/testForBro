import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";
import { MinutesStatsService } from "../../services/minutes-stats.service";
import { ApiCallsStatsService } from "../../services/api-calls-stats.service";

@Component({
  selector: "ngx-info-bar",
  templateUrl: "./info-bar.component.html"
})
export class InfoBarComponent implements OnInit, OnDestroy {
  allCallsCount: any = 0;
  batchesUploaded: any = 0;
  apiCallsCount: any = 0;
  totalMinutes: any = 0;
  dataSub1: any;
  dataSub2: any;
  dataSub3: any;
  hasData: boolean = false;
  constructor(
    private dataService: DashboardFileStatsService,
    private minutesStatsService: MinutesStatsService,
    private apiCallsStatsService: ApiCallsStatsService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.totals) {
        this.allCallsCount = data.totals.allcallscount;
        this.batchesUploaded = data.totals.batchcount;
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
    this.dataSub2 = this.minutesStatsService.data.subscribe(data => {
      if (data && data.totalMinutes) {
        this.totalMinutes = data.totalMinutes;
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
    this.dataSub3 = this.apiCallsStatsService.data.subscribe(data => {
      if (data && data.apiCallsCount) {
        this.apiCallsCount = data.apiCallsCount;
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
    if (this.dataSub2) {
      this.dataSub2.unsubscribe();
    }
    if (this.dataSub3) {
      this.dataSub3.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  getColor(i: number): string {
    const colors = [
      "#c12e34",
      "#0098d9",
      "#e6b600",
      "#2b821d",
      "#005eaa",
      "#339ca8",
      "#cda819",
      "#32a487"
    ];
    return colors[i];
  }
}
