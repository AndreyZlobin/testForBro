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
  id;
  filename;
  isLoading: boolean = true;
  fullText: string = "";
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
          this.id = this.route.snapshot.params["id"];
          this.filesService
            .getTextFileResultDetails(this.id)
            .subscribe(data => {
              if (data && data.result) {
                this.fullText = data.result.fulltext;
                this.filename = data.result.filename;
              }
              this.isLoading = false;
            });
        }
      }
    });
  }

  ngOnInit() {}
  t(v) {
    return LanguageService.t(v);
  }
}
