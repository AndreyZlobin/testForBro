import { Component, Input, OnChanges } from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FilterService } from "../../../../../services/filter.service";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "ngx-file-info",
  templateUrl: "./file-info.component.html",
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnChanges {
  file: any;
  currentTagEditIndex;
  editedFileItem;
  itemTags;
  modalRef: BsModalRef;
  fileIndex: number = -1;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(
    public filterService: FilterService,
    private modalService: BsModalService
  ) {}
  ngOnChanges(a:any) {
    this.file = this.filterService.getFile(this.batchId, this.fileName);
    this.filterService.files.subscribe(() => {
      this.file = this.filterService.getFile(this.batchId, this.fileName);
      this.fileIndex = this.filterService.getIndex(this.batchId, this.fileName);
    });
    if (!this.file) {
      this.filterService.updateFileList();
    }
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
  getOpacityLevelAnger(val) {
    let color = 100;
    const max = 25;
    const parsed = parseFloat(val.anger);
    if(parsed < max) {
      color = (parsed * 100) / max;
    }
    return "hsl(" + Math.ceil(100 - color) + ", 50%, 50%)";
  }


  getOpacityLevelCompliance(percent) {
    if (percent === '-') {
      return "hsl(0, 10%, 10%)";
    }
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
  abcStr(percent: string): string {
    const val = parseFloat(percent)
    return val.toFixed();
  }
  showModal(ref, index) {
    this.currentTagEditIndex = index;
    this.itemTags =
      (this.file.tags &&
        this.file.tags.map(v => ({
          value: v,
          display: v
        }))) ||
      [];
    this.hideModal();
    this.modalRef = this.modalService.show(ref, {
      class: "modal-xl"
    });
  }

  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  saveTags() {
    const tags = this.itemTags.map(v => v.value);
    this.filterService.setTags(this.fileIndex, tags);
    this.currentTagEditIndex = -1;
    this.hideModal();
  }

  markFavorite(item) {
    this.filterService.markFavorite(item.batchid, item.filename);
  }

  abc(percent: number): string {
    return percent.toFixed();
  }
}
