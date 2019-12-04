import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { ChartDataService } from "../../services/chart-data.service";

@Component({
  selector: "ngx-sentimental-sankey",
  templateUrl: "./sentimental-sankey.component.html"
})
export class SentimentalSankeyComponent implements OnInit, OnDestroy {
  options: any = 0;
  angercallscount: any = 0;
  silentcallscount: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  constructor(
    private dataService: ChartDataService,
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.sentiment && data.sentiment.sankeyData) {
        this.options = this.getOptions(data);
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
  }
  ngOnInit() {}
  ngOnDestroy() {
    if (this.dataSub1) {
      this.dataSub1.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  colors = [
    "#c12e34",
    "#0098d9",
    "#e6b600",
    "#2b821d",
    "#005eaa",
    "#339ca8",
    "#cda819",
    "#32a487"
  ];
  getOptions(data: any): any {
    return {
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
          data: data.sentiment.sankeyData.nodes,
          links: data.sentiment.sankeyData.links,
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
  private getRadius(r, minR, maxR) {
    if (r === minR) {
      return 20;
    } else if (r === maxR) {
      return 40;
    } else {
      return Math.floor(20 + (40 * r) / maxR);
    }
  }
}
