import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { AnalyticsService } from "../../../services/analytics.service";
import { DatepickerOptions } from "ng2-datepicker";
import { LanguageService } from "../../../services/language.service";
import { Subscription } from "rxjs";
import { DataService } from "../../../shared";

@Component({
  selector: "app-files-list",
  templateUrl: "./files-list.component.html",
  styleUrls: ["./files-list.component.scss"],
})
export class FilesListComponent implements OnInit, AfterViewInit {
  @ViewChild("scroll", {static: false}) scrollTo: ElementRef;
  trends = ["fa-angry text-danger", "fa-grin text-success", "fa-meh text-info"];
  filterName: string;
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
  topics: string[] = [];
  selectedTopics: string[] = [];
  selectedTopic: string = "";
  batches: string[] = [];
  tags: string[] = [];
  selectedTags: string[] = [];
  selectedTag: string[] = [];
  selectedBatches: string[] = [];

  constructor(
    private filesService: FilesService,
    public filterService: FilterService,
    private dataService: DataService,
    private modalService: BsModalService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.filterService.updateFileList();
    this.filesService.listTopics().subscribe((data) => {
      if (data && data.topics) {
        this.topics = data.topics;
      }
      if (this.filterService.filter.topics) {
        this.selectedTopics = this.filterService.filter.topics.split(",");
      }
    });
    this.getBatches();
    this.getTags();
  }
  ngAfterViewInit() {}
  scrollToElement() {
    if (this.scrollTo) {
      this.scrollTo.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  setStopwordLooking(value: string): void {
    this.filterService.filter.stopwordLooking = value;
  }

  getBatches() {
    this.filesService.listBatches().subscribe((data) => {
      if (data && data.batches) {
        this.batches = data.batches;
      }
    });
  }

  getTags() {
    this.filesService.listTags().subscribe((data) => {
      if (data && data.tags) {
        this.tags = data.tags;
      }
    });
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
    if (item.fileType === "audio") {
      return `/file/${encodeURIComponent(item.batchid)}/${encodeURIComponent(
        item.fileid
      )}`;
    } else {
      return `/video/${encodeURIComponent(item.batchid)}/${encodeURIComponent(
        item.fileid
      )}`;
    }
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
    let color = 100;
    const max = 25;
    const parsed = parseFloat(val.anger);
    if (parsed < max) {
      color = (parsed * 100) / max;
    }
    return "hsl(" + Math.ceil(100 - color) + ", 50%, 50%)";
  }

  getOpacityLevelCompliance(percent) {
    const a = percent / 100;
    const b = 100 * a;
    const c = b + 0;

    const val = "hsl(" + c + ", 50%, 50%)";

    // Return a CSS HSL string
    return "hsl(" + c + ", 50%, 50%)";
  }

  abc(percent: number): string {
    return percent.toFixed();
  }

  abcStr(percent: string): string {
    const val = parseFloat(percent);
    return val.toFixed();
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

  setTagsFilter() {
    if (!!this.filterService.filter.tagsOnly) {
      this.filterService.filter.tagsOnly = null;
      this.filterService.filter.noTags = null;
    } else {
      this.filterService.filter.tagsOnly = true;
      this.filterService.filter.noTags = null;
    }
    this.filterService.updateFileList();
  }

  setNoTagsFilter() {
    if (!!this.filterService.filter.noTags) {
      this.filterService.filter.noTags = null;
      this.filterService.filter.tagsOnly = null;
    } else {
      this.filterService.filter.noTags = true;
      this.filterService.filter.tagsOnly = null;
    }
    this.filterService.updateFileList();
  }

  setChecklistOnlyFilter() {
    if (!!this.filterService.filter.checklistOnly) {
      this.filterService.filter.checklistOnly = null;
      this.filterService.filter.noChecklist = null;
    } else {
      this.filterService.filter.checklistOnly = true;
      this.filterService.filter.noChecklist = null;
    }
    this.filterService.updateFileList();
  }

  setNoChecklistFilter() {
    if (!!this.filterService.filter.noChecklist) {
      this.filterService.filter.noChecklist = null;
      this.filterService.filter.checklistOnly = null;
    } else {
      this.filterService.filter.noChecklist = true;
      this.filterService.filter.checklistOnly = null;
    }
    this.filterService.updateFileList();
  }

  setCommentsOnlyFilter() {
    if (!!this.filterService.filter.commentsOnly) {
      this.filterService.filter.commentsOnly = null;
      this.filterService.filter.noComments = null;
    } else {
      this.filterService.filter.commentsOnly = true;
      this.filterService.filter.noComments = null;
    }
    this.filterService.updateFileList();
  }

  setNoCommentFilter() {
    if (!!this.filterService.filter.noComments) {
      this.filterService.filter.noComments = null;
      this.filterService.filter.commentsOnly = null;
    } else {
      this.filterService.filter.noComments = true;
      this.filterService.filter.commentsOnly = null;
    }
    this.filterService.updateFileList();
  }

  setStopOnlyFilter() {
    if (!!this.filterService.filter.stopOnly) {
      this.filterService.filter.stopOnly = null;
      this.filterService.filter.noStop = null;
    } else {
      this.filterService.filter.stopOnly = true;
      this.filterService.filter.noStop = null;
    }
    this.filterService.updateFileList();
  }

  setNoStopFilter() {
    if (!!this.filterService.filter.noStop) {
      this.filterService.filter.noStop = null;
      this.filterService.filter.stopOnly = null;
    } else {
      this.filterService.filter.noStop = true;
      this.filterService.filter.stopOnly = null;
    }
    this.filterService.updateFileList();
  }

  setMissedOnlyFilter() {
    if (!!this.filterService.filter.missingOnly) {
      this.filterService.filter.missingOnly = null;
      this.filterService.filter.noMissing = null;
    } else {
      this.filterService.filter.missingOnly = true;
      this.filterService.filter.noMissing = null;
    }
    this.filterService.updateFileList();
  }

  setNoMissedFilter() {
    if (!!this.filterService.filter.noMissing) {
      this.filterService.filter.noMissing = null;
      this.filterService.filter.missingOnly = null;
    } else {
      this.filterService.filter.noMissing = true;
      this.filterService.filter.missingOnly = null;
    }
    this.filterService.updateFileList();
  }

  setFavoriteOnlyFilter() {
    if (!!this.filterService.filter.favoriteOnly) {
      this.filterService.filter.favoriteOnly = null;
      this.filterService.filter.noFavorite = null;
    } else {
      this.filterService.filter.favoriteOnly = true;
      this.filterService.filter.noFavorite = null;
    }
    this.filterService.updateFileList();
  }

  setNoFavoriteFilter() {
    if (!!this.filterService.filter.noFavorite) {
      this.filterService.filter.noFavorite = null;
      this.filterService.filter.favoriteOnly = null;
    } else {
      this.filterService.filter.noFavorite = true;
      this.filterService.filter.favoriteOnly = null;
    }
    this.filterService.updateFileList();
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
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

  sortTable(filterName: string, sortBy: string, direction: string) {
    this.analyticsService.trackEvent("sortTable", sortBy);
    this.filterService.filter.sortorder = direction;
    this.filterService.filter.sortby = sortBy;
    this.filterName = filterName;
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
      export: "csv",
    };
    this.filesService.postListFilesPage(params).subscribe(
      (data) =>
        // this.downloadFile(data)
        (window.location.href = data.url)
    ),
      (error) => console.log("Error downloading the file."),
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

  filterByBatch(batch: string): void {
    // this.filterService.filter.batchid = batchId;

    if (this.filterService.filter.batchesContain) {
      this.filterService.filter.batchesContain = [
        ...this.filterService.filter.batchesContain,
        { display: batch, value: batch },
      ];
    } else {
      this.filterService.filter.batchesContain = [
        { display: batch, value: batch },
      ];
    }

    this.filterService.updateFileList();
  }

  showModal(ref, item, index) {
    this.analyticsService.trackEvent("fileList", "showModal");
    this.currentTagEditIndex = index;
    this.editedFileItem = item;
    this.itemTags =
      (item.tags &&
        item.tags.map((v) => ({
          value: v,
          display: v,
        }))) ||
      [];
    this.hideModal();
    this.modalRef = this.modalService.show(ref, {
      class: "modal-xl",
    });
  }

  showDeleteModal(ref, item, index) {
    this.analyticsService.trackEvent("fileList", "showDeleteModal");
    this.currentTagEditIndex = index;
    this.editedFileItem = item;
    this.hideModal();
    this.modalRef = this.modalService.show(ref, {});
  }

  deleteFile() {
    this.delete(this.editedFileItem.batchid, this.editedFileItem.filename);
    this.editedFileItem = null;
    this.currentTagEditIndex = -1;
    this.hideModal();
  }

  hideModal() {
    this.analyticsService.trackEvent("fileList", "hideModal");
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  saveTags() {
    this.analyticsService.trackEvent("fileList", "saveTags");
    const tags = this.itemTags.map((v) => v.value);
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
        c = this.filterService.filter.tagsContain;
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
    this.selectedTopic = "";
    const deduplicate = new Set([...this.selectedTopics, event.value]);
    this.selectedTopics = Array.from(deduplicate);
    this.filterService.filter.topics = this.selectedTopics.join(",");
  }

  onSelectBatchId(event: any) {
    const deduplicate = new Set([
      ...(Array.isArray(this.selectedBatches)
        ? this.selectedBatches
        : [this.selectedBatches]),
      event.value,
    ]);
    this.selectedBatches = Array.from(deduplicate);
    this.filterService.filter.batchesContain = this.selectedBatches.map(
      (v) => ({
        display: v,
        value: v,
      })
    );
  }

  onRemoveTopic(topic: string) {
    this.selectedTopics = this.selectedTopics.filter((t) => t !== topic);
    this.filterService.filter.topics = this.selectedTopics.join(",");
  }

  tagClick(tag: string) {
    if (this.filterService.filter.tagsContain) {
      this.filterService.filter.tagsContain = [
        ...this.filterService.filter.tagsContain,
        { display: tag, value: tag },
      ];
    } else {
      this.filterService.filter.tagsContain = [{ display: tag, value: tag }];
    }

    this.filterService.updateFileList();
  }
  autotagClick(tag: string) {
    if (this.filterService.filter.tagsContain) {
      this.filterService.filter.tagsContain = [
        ...this.filterService.filter.tagsContain,
        { display: tag, value: tag },
      ];
    } else {
      this.filterService.filter.tagsContain = [{ display: tag, value: tag }];
    }

    this.filterService.updateFileList();
  }

  onSelectTag(event: any) {
    const deduplicate = new Set([
      ...(Array.isArray(this.selectedTags)
        ? this.selectedTags
        : [this.selectedTags]),
      event.value,
    ]);
    this.selectedTags = Array.from(deduplicate);
    this.selectedTag = Array.from(deduplicate);
    this.filterService.filter.tagsContain = this.selectedTags.map((v) => ({
      display: v,
      value: v,
    }));
  }
  onRemoveTag(topic: any) {
    this.selectedTags = this.selectedTags.filter((t) => t !== topic.value);
    this.selectedTag = this.selectedTags;
    this.filterService.filter.tagsContain = this.selectedTags.map((v) => ({
      display: v,
      value: v,
    }));
  }
  onRemoveBatch(batch: any) {
    this.selectedBatches = this.selectedBatches.filter(
      (t) => t !== batch.value
    );
    this.filterService.filter.batchesContain = this.selectedBatches.map(
      (v) => ({
        display: v,
        value: v,
      })
    );
  }
  setTagCondition(con: string) {
    this.filterService.filter.tagsCondition = con;
  }
}
