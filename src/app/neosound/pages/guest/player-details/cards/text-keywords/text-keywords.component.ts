import {
  Component,
  Input,
  OnInit,
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
  selector: "ngx-text-keywords",
  templateUrl: "./text-keywords.component.html"
})
export class TextKeywordsComponent implements OnInit, OnDestroy {
  treeData: any;
  dataSub: any;
  isLoading: boolean = true;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(private fileChartDataService: FileChartDataService) {
    this.dataSub = this.fileChartDataService.chartData.subscribe(data => {
      if (data) {
        this.isLoading = data.isLoading;
        if (data.isLoading) {
          this.treeData = null;
        } else {
          if (data.treeRadialData) {
            this.treeData = this.init(data.treeRadialData);
          }
        }
      }
    });
  }
  ngOnInit() {
    this.fileChartDataService.getFileChartData(
      this.batchId,
      this.fileName
    );
  }
  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
  init(data) {
    return {
      color: colors,
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      series: [
        {
          type: "tree",
          data: [data],
          top: "18%",
          bottom: "14%",
          layout: "radial",
          symbol: "emptyCircle",
          symbolSize: 7,
          initialTreeDepth: 1,
          animationDurationUpdate: 750
        }
      ]
    };
  }
  t(v) {
    return LanguageService.t(v);
  }
}
