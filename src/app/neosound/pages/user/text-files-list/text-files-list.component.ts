import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { TextFilterService } from "../../../services/text-filter.service";
import { AnalyticsService } from "../../../services/analytics.service";
import { DatepickerOptions } from "ng2-datepicker";
import { LanguageService } from "../../../services/language.service";
import { DataService } from "../../../shared";

@Component({
  selector: "app-text-files-list",
  templateUrl: "./text-files-list.component.html",
  styleUrls: ["./text-files-list.component.scss"]
})
export class TextFilesListComponent implements OnInit, AfterViewInit {
  @ViewChild("scroll", {static: false}) scrollTo: ElementRef;
  errorMessage = "";
  isLoading = true;
  pagesArr = [1];
  isLoadingSpinner = false;
  lastFile: any;
  itemTags: any;
  private sideFilterHasClass = false;
  modalRef: BsModalRef;
  editedFileItem;
  currentTagEditIndex;
  batches: string[] = [];

  constructor(
    private filesService: FilesService,
    public filterService: TextFilterService,
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    private modalService: BsModalService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.filterService.updateFileList();
    this.getBatches();
  }
  getBatches() {
    this.filesService.listTextBatches().subscribe(data => {
      if (data && data.batches) {
        this.batches = data.batches;
      }
    });
  }
  ngAfterViewInit() {
    if (this.filterService.lastFileId) {
      this.scrollToElement();
      this.filterService.lastFileId = "";
    }
  }
  scrollToElement() {
    if (this.scrollTo) {
      this.scrollTo.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  setStopwordLooking(value: string): void {
    this.filterService.filter.stopwordLooking = value;
  }

  getEmotionName(val) {
    return val && Object.keys(val)[0];
  }

  getEmotionValue(val) {
    return val && val[Object.keys(val)[0]] && val[Object.keys(val)[0]] + "%";
  }

  refresh() {
    this.analyticsService.trackEvent("fileList", "refresh");
    this.filterService.updateFileList();
  }

  delete(id) {
    this.analyticsService.trackEvent("fileList", "delete");
    this.filterService.deteleFile(id);
  }

  getLink(item) {
    return `/text/${encodeURIComponent(item.id)}`;
  }

  proccessFile(item) {
    this.filterService.processFile(item.batchid, item.filename);
  }

  getEmotionImg(item) {
    if (!item || !item.fourclasstop) return "";
    const emK = Object.keys(item.fourclasstop);
    const img = emK && emK[0];
    return img ? img.toLowerCase() : "neutral";
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

  getOpacityLevelCompliance(percent) {
    const a = percent / 100;
    const b = 100 * a;
    const c = b + 0;

    // Return a CSS HSL string
    return "hsl(" + c + ", 50%, 50%)";
  }

  abc(percent: number): string {
    return percent.toFixed();
  }

  getOpacityLevelPause(val) {
    if (!val) {
      return "";
    }
    let result;
    if (val < 1) {
      result = 0;
    }
    result = val / 50;
    return "rgba(5, 5, 255, " + result + ")";
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  sortTable(sortBy) {
    this.analyticsService.trackEvent("sortTable", sortBy);
    if(this.filterService.filter.sortorder === "desc") {
      this.filterService.filter.sortorder = "asc";
    } else {
      this.filterService.filter.sortorder = "desc";
    }

    this.filterService.filter.sortby = sortBy;
    this.filterService.updateFileList();
  }

  resetFilter() {
    this.filterService.resetFilter();
  }

  exportCSV() {
    this.analyticsService.trackEvent("fileList", "exportCSV");
    const params = {
      ...this.filterService.getFilterParams(),
      export: "csv"
    };
    this.filesService.postListTextFiles(params).subscribe(
      data => {
        if(data.url) {
          window.location.href = data.url
        }
      }
    ),
      error => console.log("Error downloading the file."),
      () => console.info("OK");
  }

  getPage(pageNum) {
    this.filterService.filter.pagen = pageNum;
    this.filterService.updateFileList();
  }

  filterIt() {
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

  getMisswords(item) {
    return item.misswords && item.misswords.length
      ? item.misswords.join(", ")
      : "";
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

  get primaryColor() {
    return (
      (this.dataService.config &&
        (this.dataService.config as any).colors &&
        (this.dataService.config as any).colors.primary) ||
      "rgb(0, 154, 210)"
    );
  }

  get secondaryColor() {
    return (
      (this.dataService.config &&
        (this.dataService.config as any).colors &&
        (this.dataService.config as any).colors.secondary) ||
      "rgb(0, 154, 210)"
    );
  }

  filterByBatch(batchId: string): void {
    this.filterService.filter.batchid = batchId;
    this.filterService.updateFileList();
  }

  showModal(ref, item, index) {
    this.analyticsService.trackEvent("fileList", "showModal");
    this.currentTagEditIndex = index;
    this.editedFileItem = item;
    this.itemTags =
      (item.tags &&
        item.tags.map(v => ({
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
    this.analyticsService.trackEvent("fileList", "hideModal");
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  saveTags() {
    this.analyticsService.trackEvent("fileList", "saveTags");
    const tags = this.itemTags.map(v => v.value);
    this.filterService.setTags(this.currentTagEditIndex, tags);
    this.currentTagEditIndex = -1;
    this.hideModal();
  }

  markFavorite(id, filename) {
    this.analyticsService.trackEvent("textFileList", "markFavorite");
    this.filterService.markFavorite(id, filename);
  }

  getBool(v) {
    return v === "true";
  }

  onItemAdd(tag: any, container) {
    let c;
    switch (container) {
      case "keywordsContain":
        c = this.filterService.filter.keywordsContain;
        break;
      case "keywordsNotContain":
        c = this.filterService.filter.keywordsNotContain;
        break;
      case "itemTags":
        c = this.itemTags;
        break;
      case "tagsContain":
        c = this.itemTags;
        break;
    }

    const tagVal = tag && tag.value || tag;
    if (tagVal === "") {
      return;
    }
  }
}
