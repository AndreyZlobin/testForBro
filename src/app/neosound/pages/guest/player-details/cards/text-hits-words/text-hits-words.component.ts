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
  selector: "ngx-text-hits-words",
  templateUrl: "./text-hits-words.component.html",
  providers: [FileChartDataService]
})
export class TextHitsWordsComponent implements OnChanges, OnDestroy {
  popularWords: string[];
  dataSub: any;
  isLoading: boolean = true;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(private fileChartDataService: FileChartDataService) {
    this.dataSub = this.fileChartDataService.chartData.subscribe(data => {
      if (data && data.popularWords) {
        this.popularWords = data.popularWords;
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
  t(v) {
    return LanguageService.t(v);
  }
}
