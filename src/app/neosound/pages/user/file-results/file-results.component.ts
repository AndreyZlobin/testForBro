import { Component, OnInit } from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { TextFilterService } from "../../../services/text-filter.service";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";

import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-file-results",
  templateUrl: "./file-results.component.html",
  styleUrls: ["./file-results.component.scss"]
})
export class FileResultsComponent implements OnInit {
  batchid;
  filename;
  isLoading: boolean = true;
  constructor(
    private filesService: FilesService,
    private filterService: TextFilterService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private dataService: DataService
  ) {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith("/text/")) {
          this.batchid = this.route.snapshot.params["batchid"];
          this.filename = this.route.snapshot.params["filename"];
          this.isLoading = false;

        }
      }
    });
  }

  ngOnInit() {}
  t(v) {
    return LanguageService.t(v);
  }
}
