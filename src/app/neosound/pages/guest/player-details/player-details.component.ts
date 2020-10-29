import { Component, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { LanguageService } from "../../../services/language.service";
import { PlayerComponent } from "./player/player.component";

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
})
export class PlayerDetailsComponent {
  @ViewChild(PlayerComponent)
  player: PlayerComponent;
  filename: string = "";
  batchid: string = "";
  showComments: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) {
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
          if (this.batchid !== batchid || this.filename !== filename) {
            this.filename = filename;
            this.batchid = batchid;
          }
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
  public print() {
    window.print();
  }

}
