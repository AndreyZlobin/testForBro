import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FilterService } from "../../../services/filter.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../services/language.service";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { FileResultService } from "../player-details/services/file-result.service";
import { FileInfoService } from "../player-details/services/file-info.service";
import { FilePeeksService } from "../player-details/services/file-peeks.service";
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
  selector: "ngx-analytic-details",
  templateUrl: "./analytic-details.component.html",
  styleUrls: ["./analytic-details.component.scss"]
})
export class AnalyticDetailsComponent {
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
        if (event.url.startsWith("/analytic/")) {
          this.currentView = null;
          const batchid = decodeURIComponent(
            this.route.snapshot.params["batchid"]
          );
          const filename = decodeURIComponent(
            this.route.snapshot.params["filename"]
          );
          if (this.batchid !== batchid || this.filename !== filename) {
            this.filename = filename;
            this.batchid = batchid;
            this.fileResultService.getResult(this.batchid, this.filename);
          }
        }
      });
  }

  changeTab(): void {
    this.router.navigateByUrl(this.getLink());
  }
  getLink(): string {
    return (
      "/file/" +
      encodeURIComponent(this.batchid) +
      "/" +
      encodeURIComponent(this.filename)
    );
  }

  t(v) {
    return LanguageService.t(v);
  }
}
