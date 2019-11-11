import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FileChartDataService } from "../../services/file-chart-data.service";
import { ToastrService } from "ngx-toastr";

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
  selector: "ngx-text-sankey",
  templateUrl: "./text-sankey.component.html",
  providers: [FileChartDataService]
})
export class TextSankeyComponent implements OnChanges, OnDestroy {
  sankeyData: any;
  dataSub: any;
  isLoading: boolean = true;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(private fileChartDataService: FileChartDataService) {
    this.dataSub = this.fileChartDataService.chartData.subscribe(data => {
      if (data && data.sankeyData) {
        this.sankeyData = this.init(data.sankeyData.nodes, data.sankeyData.links);
        this.isLoading = false;
      }
    });
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.fileChartDataService.getFileChartData(this.batchId, this.fileName);
  }
  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
  init(nodes, links) {
    return {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      color: colors,
      graph: {
        color: colors
      },
      series: [
        {
          type: "sankey",
          data: nodes,
          links: links,
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
  t(v) {
    return LanguageService.t(v);
  }
}
