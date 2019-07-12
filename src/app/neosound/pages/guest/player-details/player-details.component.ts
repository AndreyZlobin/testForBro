import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { PlayerService } from "../../../services/player.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";

@Component({
  selector: "ngx-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent implements OnInit {
  isLoading: boolean = true;
  fileParams;
  subRoute: Subscription;
  errorMessage = "";
  constructor(private router: Router, private route: ActivatedRoute) {
    this.subRoute = this.route.params.subscribe(
      params => {
        if (params && params.filename && params.batchid) {
          this.fileParams = {
            filename: decodeURIComponent(params.filename),
            batchid: decodeURIComponent(params.batchid)
          };
        }
      },
      e => {
        if (e.status === 502 || e.status === 404 || e.status === 429) {
          this.router.navigateByUrl("/404");
        }
        this.errorMessage = e.error.message;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subRoute.unsubscribe();
  }
}
