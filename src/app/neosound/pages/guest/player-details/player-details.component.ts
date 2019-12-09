import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FilterService } from "../../../services/filter.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { PlayerComponent } from "./player/player.component";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { FileResultService } from "./services/file-result.service";
import { FileInfoService } from "./services/file-info.service";
import { FilePeeksService } from "./services/file-peeks.service";
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
  filename: string = "";
  batchid: string = "";
  subRoute: Subscription;
  routeSub: Subscription;
  file: any;
  constructor(
    public filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute,
    public fileResultService: FileResultService,
    public fileInfoService: FileInfoService,
    public filePeeksService: FilePeeksService
  ) {
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (event.url.startsWith("/file/")) {
          const batchid = decodeURIComponent(
            this.route.snapshot.params["batchid"]
          );
          const filename = decodeURIComponent(
            this.route.snapshot.params["filename"]
          );
          this.currentView = "";
          this.isLoading = true;
          setTimeout(() => {
            if (this.batchid !== batchid || this.filename !== filename) {
              this.filename = filename;
              this.batchid = batchid;
              this.currentView = "player";
              this.isLoading = false;
              this.fileResultService.getResult(this.batchid, this.filename);
              this.filePeeksService.getAudioWaveForm(
                this.batchid,
                this.filename
              );
              this.fileInfoService.getInfo(this.batchid, this.filename);
            }
          }, 10);
        }
      });
  }

  getLink() {
    return (
      "/analytic/" +
      encodeURIComponent(this.batchid) +
      "/" +
      encodeURIComponent(this.filename)
    );
  }

  t(v) {
    return LanguageService.t(v);
  }

  public goToRegion(time: any) {
    this.player && this.player.seekTo(time);
  }
}
