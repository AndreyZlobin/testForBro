import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CloudData } from "angular-tag-cloud-module";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatepickerOptions } from "ng2-datepicker";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { DataService } from "../../../shared";
import { AnalyticsService } from "../../../services/analytics.service";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../../services/language.service";

import { ApiCallsStatsService } from "./services/api-calls-stats.service";
import { ChartDataService } from "./services/chart-data.service";
import { DashboardFileStatsService } from "./services/file-stats.service";
import { MinutesStatsService } from "./services/minutes-stats.service";
import { TagCloudService } from "./services/tag-cloud.service";
import { TopicCloudService } from "./services/topic-cloud.service";

export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487"
]; //shine

const rgbToHex = rgb => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const fullColorHex = (r, g, b) => {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red + green + blue;
};

@Component({
  selector: "app-calls-dashboard",
  templateUrl: "./calls-dashboard.component.html",
  styleUrls: ["./calls-dashboard.component.scss"]
})
export class CallsDashboardComponent implements OnInit, OnChanges {
  @Input() dateFrom: string;
  @Input() dateTo: string;
  @Input() batches: string[];
  settings: any = {};
  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    public dataService: DataService,
    private filterService: FilterService,
    private apiCallsStatsService: ApiCallsStatsService,
    private chartDataService: ChartDataService,
    private dashboardFileStatsService: DashboardFileStatsService,
    private minutesStatsService: MinutesStatsService,
    private tagCloudService: TagCloudService,
    private topicCloudService: TopicCloudService
  ) {
    this.settings = JSON.parse(localStorage.getItem("settings")).dashboardcards;
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    const params = {
      source: "audio"
    };
    if (changes.dateFrom.currentValue) {
      params["dateFrom"] = changes.dateFrom.currentValue;
    }
    if (changes.dateFrom.currentValue) {
      params["dateTo"] = changes.dateTo.currentValue;
    }
    if (changes.batches.currentValue) {
      params["batches"] = changes.batches.currentValue;
    }
    this.loadData(params["dateFrom"], params["dateTo"], params["batches"]);
  }

  loadData(dateFrom, dateTo, batches) {
    const source = "audio";
    this.apiCallsStatsService.load(source, dateFrom, dateTo, batches);
    this.chartDataService.load(source, dateFrom, dateTo, batches);
    this.dashboardFileStatsService.load(source, dateFrom, dateTo, batches);
    this.minutesStatsService.load(source, dateFrom, dateTo, batches);
    this.tagCloudService.load(source, dateFrom, dateTo, batches);
    this.topicCloudService.load(source, dateFrom, dateTo, batches);
  }
  keywordClicked(clicked: string) {
    this.analyticsService.trackEvent("user", "keywordClicked");
    this.filterService.filter.keywordsContain = [
      { display: clicked, value: clicked }
    ];
    this.router.navigateByUrl("/user/files");
  }
  topicClicked(clicked: string) {
    this.analyticsService.trackEvent("user", "topicClicked");
    this.filterService.filter.topics = clicked;
    this.router.navigateByUrl("/user/files");
  }

  batchClicked(batchId: string) {
    this.analyticsService.trackEvent("user", "batchClicked");
    this.filterService.filter.batchid = batchId;
    this.router.navigateByUrl("/user/files");
  }
  sentimentTrendClicked(trendName: string) {
    this.analyticsService.trackEvent("user", "sentimentTrendClicked");
    this.filterService.filter.sentimentTrend = trendName;
    this.router.navigateByUrl("/user/files");
  }

  t(v) {
    return LanguageService.t(v);
  }
  show(name: string) {
    return this.settings && this.settings[name] && this.settings[name].show
  }

}
