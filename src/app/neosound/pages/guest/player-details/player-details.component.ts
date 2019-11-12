import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { PlayerService } from "../../../services/player.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";
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
          if (filename && batchid) {
            this.filename = decodeURIComponent(filename);
            this.batchid = decodeURIComponent(batchid);
          }
        }
      });
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
