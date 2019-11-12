import {
  Component,
  Input,
  OnInit,
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
export class TextTagCloudComponent implements OnInit, OnDestroy, AfterViewInit {
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
      if (data) {
        this.isLoading = data.isLoading;
        if (data.isLoading) {
          this.popularWords = [];
        } else {
          if (data.popularWords) {
            this.popularWords = data.popularWords.map(v => [v.text, v.weight]);
            this.init();
          }
        }
      }
    });
  }
  ngOnInit() {
    this.fileChartDataService.getFileChartData(this.batchId, this.fileName);
  }
  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
  ngAfterViewInit() {}

  init() {
    WordCloud(document.getElementById("texttagcloud"), {
      list: this.popularWords,
      rotateRatio: 0,
      fontFamily: "Roboto",
      shape: "square"
    });
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
