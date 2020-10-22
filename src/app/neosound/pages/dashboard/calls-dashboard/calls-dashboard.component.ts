import { UtilsService } from './../../../shared/utils.service';
import { DataModule } from './../../../../@core/data/data.module';
import {
  Component,
  OnInit,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { FilterService } from "../../../services/filter.service";
import { DataService } from "../../../shared";
import { AnalyticsService } from "../../../services/analytics.service";
import { LanguageService } from "../../../services/language.service";
import { Subject } from 'rxjs';

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
export class CallsDashboardComponent implements OnInit {
  @Input() dateFrom: string;
  @Input() dateTo: string;
  @Input() batches: string[];
  settings: any = {};
  private readonly _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    public dataService: DataService,
    private filterService: FilterService,
    private utils: UtilsService,
  ) {
    this.settings = JSON.parse(localStorage.getItem("settings")).dashboardcards;
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.utils.stopSubscriptions(this._unsubscribe$);
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
  sentimentTrendClicked(event: any) {
    this.analyticsService.trackEvent("user", "sentimentTrendClicked");
    this.filterService.filter.sentimentTrend = event.trend;
    this.filterService.filter.batchid = event.batchId;
    this.router.navigateByUrl("/user/files");
  }

  t(v) {
    return LanguageService.t(v);
  }
  show(name: string) {
    return this.settings && this.settings[name] && this.settings[name].show;
  }

}
