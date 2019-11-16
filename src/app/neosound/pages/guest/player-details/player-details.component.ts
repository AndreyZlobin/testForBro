import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FilterService } from "../../../services/filter.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { PlayerComponent } from "./player/player.component";
import "rxjs/add/operator/filter";

export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487"
];

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent {
  @ViewChild(PlayerComponent)
  player: PlayerComponent;
  currentView: string;
  isLoading: boolean = true;
  filename: string;
  batchid: string;
  subRoute: Subscription;
  routeSub: Subscription;
  file: any;
  constructor(
    public filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (event.url.startsWith("/file/")) {
          this.currentView = null;
          const batchid = this.route.snapshot.params["batchid"];
          const filename = this.route.snapshot.params["filename"];
          this.file = {
            batchid: "tests",
            fileid: "9.wav",
            filename: "9.wav",
            uploaddate: "2019-10-30T05:36:08.843Z",
            duration: "2171.74",
            angertop: { anger: "0.17" },
            pin: "false",
            pauses: "1.61",
            pause: { avg: "1.61", dur: "941.75" },
            stopwords: ["don't know", "stop"],
            stopwordcount: 2,
            agentstopwordcount: 0,
            customerstopwords: ["don't know", "stop"],
            customerstopwordcount: 2,
            misswordcount: 0,
            compliancepercent: 100.0,
            sentimentTrend: { start: "Positive", end: "Positive" },
            topic: { topic: "Technology", confidence: "100." }
          };
          if (filename && batchid) {
            this.filename = decodeURIComponent(filename);
            this.batchid = decodeURIComponent(batchid);
          }
        }
      });
  }
  getKeywords(item) {
    return item.keywords && item.keywords.length
      ? item.keywords.join(", ")
      : "";
  }

  public abs(v: number): number {
    return Math.abs(v);
  }

  getMisswords(item) {
    return item.misswords && item.misswords.length
      ? item.misswords.join(", ")
      : "";
  }
  getOpacityLevelAnger(val) {
    if (!val) {
      return "";
    }
    let result;
    if (val.anger < 1) {
      result = 0;
    }
    result = val.anger / 2 / 100;
    return "rgba(255, 5, 5, " + result + ")";
  }
  hasTrend(sentimentTrend) {
    return sentimentTrend.start && sentimentTrend.end;
  }
  getTrend(itemTrend) {
    if (itemTrend === "Negative") {
      return "fa-angry text-danger";
    }
    if (itemTrend === "Positive") {
      return "fa-grin text-success";
    }
    if (itemTrend === "Neutral") {
      return "fa-meh text-info";
    }
    return "fa-meh";
  }
  getOpacityLevelCompliance(percent) {
    const a = percent / 100;
    const b = 100 * a;
    const c = b + 0;

    // Return a CSS HSL string
    return "hsl(" + c + ", 50%, 50%)";
  }

  getStopwords(item) {
    return item.stopwords && item.stopwords.length
      ? item.stopwords.join(", ")
      : "";
  }
  getCustomerStopword(item) {
    return item.customerstopwords && item.customerstopwords.length
      ? item.customerstopwords.join(", ")
      : "";
  }
  getAgentStopwords(item) {
    return item.agentstopwords && item.agentstopwords.length
      ? item.agentstopwords.join(", ")
      : "";
  }
  getFormatedTime(val: string): string {
    const time = parseFloat(val);
    if (time < 60) {
      if (time < 10) {
        return `00:0${Math.ceil(time)}`;
      } else {
        return `00:${Math.ceil(time)}`;
      }
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time - minutes * 60);
      let formatedSeconds = "";
      if (seconds < 10) {
        formatedSeconds = `0${seconds}`;
      } else {
        formatedSeconds = `${seconds}`;
      }
      if (minutes < 10) {
        return `0${minutes}:${formatedSeconds}`;
      } else {
        return `${minutes}:${formatedSeconds}`;
      }
    }
  }
  changeTab(event: any): void {
    if (this.currentView === "player") {
      this.currentView = "analytic";
      return;
    }
    if (!this.currentView || this.currentView === "analytic") {
      this.currentView = "player";
      return;
    }
  }

  public goToRegion(time: any) {
    this.player && this.player.seekTo(time);
  }

  t(v) {
    return LanguageService.t(v);
  }
}
