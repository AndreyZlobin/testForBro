
import {filter} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { LanguageService } from "../../../services/language.service";
import { VideoPlayerComponent } from "./video-player/video-player.component";

@Component({
  selector: "ngx-video-player-details",
  templateUrl: "./video-details.component.html",
  styleUrls: ["./video-details.component.scss"]
})
export class VideoDetailsComponent {
  @ViewChild(VideoPlayerComponent, {static: false})
  player: VideoPlayerComponent;
  filename: string = "";
  batchid: string = "";
  showComments: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.startsWith("/video/")) {
          const batchid = decodeURIComponent(
            this.route.snapshot.params["batchid"]
          );
          const filename = decodeURIComponent(
            this.route.snapshot.params["filename"]
          );
          if (this.batchid !== batchid || this.filename !== filename) {
            this.filename = filename;
            this.batchid = batchid;
          }
        }
      });
  }

  t(v) {
    return LanguageService.t(v);
  }

  getLink() {
    return (
      "/analytic/" +
      encodeURIComponent(this.batchid) +
      "/" +
      encodeURIComponent(this.filename)
    );
  }

  public goToRegion(time: any) {
    this.player.goToRegion(time);
  }

}
