import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
  ViewChild
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { PlayerService } from "../../../services/player.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";
import { PlayerComponent } from "./player/player.component";

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
export class PlayerDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(PlayerComponent)
  player: PlayerComponent;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  currentView: string;
  colors = colors;
  sankey: any;
  isLoading: boolean = true;
  fileParams;
  results;
  treeRadialData: any;
  popularWords: any;
  emotions: any[] = [];
  intervalRef;
  analysisResult;
  chartData;
  fileUrl;
  wavesurfer;
  wavesurferReady = false;
  attempsCount = 20;
  subRoute: Subscription;
  zoomLevel = 200;
  errorMessage = "";
  emotionsAnger;
  emotionsAge;
  emotionsFourclass;
  emotionsSounds;
  emotionsGender;
  sttfulltext;
  keywords;
  misswords = [];
  misswordsNotFound = [];
  emotionsSttAnger;
  currentTab = "text";
  tabsDisabled = false;
  isScroll = false;
  duration = 0;
  radioModel = "Log";
  onhold;
  greySpeaker = "";
  regions = [];
  changed = false;
  routeSub: Subscription;
  @HostListener("document:keyup", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === "Space") {
      this.player.play();
      event.stopPropagation();
    }
  }
  constructor(
    private filesService: FilesService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private dataService: DataService
  ) {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        this.fileUrl = null;
        this.regions = [];
        this.currentView = "analytic";
        if (event.url.startsWith("/file/")) {
          const batchid = this.route.snapshot.params["batchid"];
          const filename = this.route.snapshot.params["filename"];
          if (filename && batchid) {
            this.fileParams = {
              filename: decodeURIComponent(filename),
              batchid: decodeURIComponent(batchid)
            };
          }
        }
      }
    });
  }

  ngAfterViewInit() {}
  trackElement(index: number, element: any) {
    return element ? element.guid : null;
  }
  ngOnInit() {}
  changeTab(event: any): void {
    if (this.currentView === "player") {
      this.currentView = "analytic";
      return;
    }
    if (this.currentView === "analytic") {
      this.currentView = "player";
      return;
    }
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  public goToRegion(time: any) {
    this.player.seekTo(time);
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  t(v) {
    return LanguageService.t(v);
  }

  get secondaryColor() {
    return (
      (this.dataService.config &&
        (this.dataService.config as any).colors &&
        (this.dataService.config as any).colors.secondary) ||
      "rgb(0, 154, 210)"
    );
  }
}
