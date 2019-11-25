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
import { FilterService } from "../../../services/filter.service";
import { AnalyticsService } from "../../../services/analytics.service";
import { DatepickerOptions } from "ng2-datepicker";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { LanguageService } from "../../../services/language.service";
import { Subscription } from "rxjs";
import { DataService } from "../../../shared";

@Component({
  selector: "app-files-list",
  templateUrl: "./files-list.component.html",
  styleUrls: ["./files-list.component.scss"]
})
export class FilesListComponent implements OnInit, AfterViewInit {
  @ViewChild("scroll") scrollTo: ElementRef;
  trends= [ "fa-angry text-danger",  "fa-grin text-success", "fa-meh text-info"];
  errorMessage = "";
  isLoading = true;
  pagesArr = [1];
  isLoadingSpinner = false;
  lastFile: any;
  itemTags: any;

  datePickerFromOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    barTitleIfEmpty: "Click to select a date",
    placeholder: this.t("from"), // HTML input placeholder attribute (default: '')
    addClass: "form-control form-control-lg form-gr-first", // Optional, value to pass on to [ngClass] on the input field
    addStyle: { width: "100%" }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: "my-date-picker", // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };

  datePickerToOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    barTitleIfEmpty: "Click to select a date",
    placeholder: this.t("to"), // HTML input placeholder attribute (default: '')
    addClass: "form-control form-control-lg form-gr-last", // Optional, value to pass on to [ngClass] on the input field
    addStyle: { width: "100%" }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: "my-date-picker", // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };
  private sideFilterHasClass = false;
  modalRef: BsModalRef;
  editedFileItem;
  currentTagEditIndex;
  topics: string[] = [];
  selectedTopics: string[] = [];
  selectedTopic: string = "";

  constructor(
    private filesService: FilesService,
    public filterService: FilterService,
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    private modalService: BsModalService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.filterService.updateFileList();
    this.filesService.listTopics().subscribe((data) => {
      if(data && data.topics) {
        this.topics = data.topics;
      }
      if(this.filterService.filter.topics) {
        this.selectedTopics = this.filterService.filter.topics.split(",");
      }
    });
  }
  ngAfterViewInit() {
  }
  scrollToElement() {
    if (this.scrollTo) {
      this.scrollTo.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  setStopwordLooking(value: string): void {
    this.filterService.filter.stopwordLooking = value;
  }
  setEmotionalTrend(value: string): void {
    this.filterService.filter.sentimentTrend = value;
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

  delete(batchid, filename) {
    this.analyticsService.trackEvent("fileList", "delete");
    this.filterService.deteleFile(batchid, filename);
  }

  getLink(item) {
    return `/file/${encodeURIComponent(item.batchid)}/${encodeURIComponent(
      item.fileid
    )}`;
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

  getTrend(itemTrend) {
    if(itemTrend === "Negative") {
      return  "fa-angry text-danger";
    }
    if(itemTrend === "Positive") {
      return  "fa-grin text-success"
    }
    if(itemTrend === "Neutral") {
      return  "fa-meh text-info"
    }
    return "fa-meh";
  }

  sortTable(sortBy) {
    this.analyticsService.trackEvent("sortTable", sortBy);
    if (sortBy !== this.filterService.filter.sortby) {
      this.filterService.filter.sortorder = "asc";
    } else {
      if (this.filterService.filter.sortorder === "desc") {
        this.filterService.filter.sortorder = "asc";
      } else {
        this.filterService.filter.sortorder = "desc";
      }
    }

    this.filterService.filter.sortby = sortBy;
    this.filterService.updateFileList();
  }

  hasTrend(sentimentTrend) {
    return sentimentTrend.start && sentimentTrend.end;
  }

  resetFilter() {
    this.filterService.resetFilter();
    this.selectedTopics = [];
  }

  exportCSV() {
    this.analyticsService.trackEvent("fileList", "exportCSV");
    const params = {
      ...this.filterService.getFilterParams(),
      export: "csv"
    };
    this.filesService.postListFilesPage(params).subscribe(
      data =>
        // this.downloadFile(data)
        (window.location.href = data.url)
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

  markFavorite(item) {
    this.analyticsService.trackEvent("fileList", "markFavorite");
    this.filterService.markFavorite(item.batchid, item.filename);
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

    const tagVal = (tag && tag.value) || tag;
    if (tagVal === "") {
      return;
    }
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

  onSelectTopic(event: any) {
    this.selectedTopic = '';
    const deduplicate = new Set([
      ...this.selectedTopics,
      event.value
    ]);
    this.selectedTopics = Array.from(deduplicate);
    this.filterService.filter.topics = this.selectedTopics.join(",");
  }

  onRemoveTopic(topic: string) {
    this.selectedTopics = this.selectedTopics.filter((t) => t !== topic);
    this.filterService.filter.topics = this.selectedTopics.join(",");
  }
}
