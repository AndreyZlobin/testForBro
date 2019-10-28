import { Component, OnInit } from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { TextFilterService } from "../../../services/text-filter.service";
import { LanguageService } from "../../../services/language.service";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../../../shared";

import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

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
  selector: "app-file-results",
  templateUrl: "./file-results.component.html",
  styleUrls: ["./file-results.component.scss"]
})
export class FileResultsComponent implements OnInit {
  id;
  public zoomOPtions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  colors = colors;
  filename;
  isLoading: boolean = true;
  fullText: string = "";
  sankey: any;
  treeRadialData: any;
  popularWords: any;
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
          this.getAnalytics(this.id);
        }
      }
    });
  }

  ngOnInit() {}
  t(v) {
    return LanguageService.t(v);
  }

  getAnalytics(id: string) {
    this.isLoading = true;
    this.filesService
      .getDetailsEchartData({ source: "email", id })
      .subscribe(data => {
        if (data.sankeyData) {
          this.sankey = {
            tooltip: {
              trigger: "item",
              triggerOn: "mousemove"
            },
            color: this.colors,
            graph: {
              color: this.colors
            },
            series: [
              {
                type: "sankey",
                data: data.sankeyData.nodes,
                links: data.sankeyData.links,
                focusNodeAdjacency: "allEdges",
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: "#aaa"
                  }
                },
                lineStyle: {
                  normal: {
                    color: "source",
                    curveness: 0.5
                  }
                }
              }
            ]
          };
        }
        if (data.treeRadialData) {
          this.treeRadialData = {
            color: this.colors,
            tooltip: {
              trigger: 'item',
              triggerOn: 'mousemove',
            },
            series: [
              {
                type: 'tree',
                data: [data.treeRadialData],
                top: '18%',
                bottom: '14%',
                layout: 'radial',
                symbol: 'emptyCircle',
                symbolSize: 7,
                initialTreeDepth: 1,
                animationDurationUpdate: 750,
              },
            ],
          };
        }
        if (data.popularWords) {
          this.popularWords = data.popularWords;
        }
        this.isLoading = false;
      });
  }
}
