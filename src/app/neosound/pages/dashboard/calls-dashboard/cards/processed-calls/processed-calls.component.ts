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
  selector: "ngx-processed-calls",
  templateUrl: "./processed-calls.component.html",
  styleUrls: ["./processed-calls.component.scss"]
})
export class ProcessedCallsComponent implements OnInit, OnDestroy {
  allcallscount: any = 0;
  angercallscount: any = 0;
  silentcallscount: any = 0;
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
        this.allcallscount = data.totals.allcallscount;
        this.angercallscount = data.totals.angercallscount;
        this.silentcallscount = data.totals.silentcallscount;
        this.hasData = true;
      }
    });
    this.dataSub2 = this.minutesStatsService.data.subscribe(data => {
      if (data) {
        this.totalMinutes = Math.round(data.totalMinutes);
        this.hasData = true;
      }
    });
    this.dataSub3 = this.apiCallsStatsService.data.subscribe(data => {
      if (data) {
        this.apiCallsCount = data.apiCallsCount;
        this.hasData = true;
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
