import { Component, Input, OnInit } from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FilterService } from "../../../../../services/filter.service";

@Component({
  selector: "ngx-file-info",
  templateUrl: "./file-info.component.html"
})
export class FileInfoComponent implements OnInit {
  file: any;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(private filterService: FilterService) {}
  ngOnInit() {
    this.filterService.files.subscribe(() => {
      this.file = this.filterService.getFile(this.batchId, this.fileName);
      console.log(this.file);
    });
    this.filterService.updateFileList();
  }
  t(v) {
    return LanguageService.t(v);
  }
  getKeywords(item) {
    return item.keywords && item.keywords.length
      ? item.keywords.join(", ")
      : "";
  }

  public abs(v: number): number {
    return Math.abs(v);
  }

  getMisswords(item) {
    return item.misswords && item.misswords.length
      ? item.misswords.join(", ")
      : "";
  }
  getOpacityLevelAnger(val) {
    if (!val) {
      return "";
    }
    let result;
    if (val.anger < 1) {
      result = 0;
    }
    result = val.anger / 2 / 100;
    return "rgba(255, 5, 5, " + result + ")";
  }
  hasTrend(sentimentTrend) {
    return sentimentTrend.start && sentimentTrend.end;
  }
  getBool(v) {
    return v === "true";
  }
  getTrend(itemTrend) {
    if (itemTrend === "Negative") {
      return "fa-angry text-danger";
    }
    if (itemTrend === "Positive") {
      return "fa-grin text-success";
    }
    if (itemTrend === "Neutral") {
      return "fa-meh text-info";
    }
    return "fa-meh";
  }
  getOpacityLevelCompliance(percent) {
    const a = percent / 100;
    const b = 100 * a;
    const c = b + 0;

    // Return a CSS HSL string
    return "hsl(" + c + ", 50%, 50%)";
  }

  getStopwords(item) {
    return item.stopwords && item.stopwords.length
      ? item.stopwords.join(", ")
      : "";
  }
  getCustomerStopword(item) {
    return item.customerstopwords && item.customerstopwords.length
      ? item.customerstopwords.join(", ")
      : "";
  }
  getAgentStopwords(item) {
    return item.agentstopwords && item.agentstopwords.length
      ? item.agentstopwords.join(", ")
      : "";
  }
  getFormatedTime(val: string): string {
    const time = parseFloat(val);
    if (time < 60) {
      if (time < 10) {
        return `00:0${Math.ceil(time)}`;
      } else {
        return `00:${Math.ceil(time)}`;
      }
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time - minutes * 60);
      let formatedSeconds = "";
      if (seconds < 10) {
        formatedSeconds = `0${seconds}`;
      } else {
        formatedSeconds = `${seconds}`;
      }
      if (minutes < 10) {
        return `0${minutes}:${formatedSeconds}`;
      } else {
        return `${minutes}:${formatedSeconds}`;
      }
    }
  }
}
