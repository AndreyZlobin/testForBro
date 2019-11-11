import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DataService } from "../../../../../shared/data.service";
import { FileChartDataService } from "../../services/file-chart-data.service";
import * as WordCloud from "wordcloud";

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
  selector: "ngx-text-tag-cloud",
  templateUrl: "./text-tag-cloud.component.html"
})
export class TextTagCloudComponent
  implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild("texttagcloud") canvas: ElementRef;
  popularWords: any;
  dataSub: any;
  isLoading: boolean = true;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(
    private fileChartDataService: FileChartDataService,
    private dataService: DataService
  ) {
    this.dataSub = this.fileChartDataService.chartData.subscribe(data => {
      if (data && data.popularWords) {
        this.popularWords = data.popularWords.map(v => [v.text, v.weight]);
        this.isLoading = false;
        this.init();
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
  ngAfterViewInit() {
    this.init();
  }
  init() {
    if (this.canvas) {
      // WordCloud(this.canvas.nativeElement, {
      //   list: this.popularWords,
      //   rotateRatio: 0,
      //   shape: "square",
      //   color: this.secondaryColor()
      // });
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  secondaryColor() {
    return (
      (this.dataService.config &&
        (this.dataService.config as any).colors &&
        (this.dataService.config as any).colors.secondary) ||
      "rgb(0, 154, 210)"
    );
  }
}
