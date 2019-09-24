import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { FilesService } from "../../../services/files.service";
import { AnalyticsService } from "../../../services/analytics.service";
import { DatepickerOptions } from "ng2-datepicker";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { LanguageService } from "../../../services/language.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { DataService } from "../../../shared";

@Component({
  selector: "app-files-list",
  templateUrl: "./files-list.component.html",
  styleUrls: ["./files-list.component.scss"]
})
export class FilesListComponent implements OnInit, OnDestroy, AfterViewInit {
  sub: Subscription;
  files;
  errorMessage = "";
  filesResult = [];
  isLoading = true;
  proccessing = {};
  pagesArr = [1];
  totalCount = 0;
  sortBy = "uploaded";
  sort = "up";
  filter;
  datefrom; // = new Date();
  dateto; //  = new Date();
  angerfrom; // = 0;
  angerto; //  = 100;
  pauseAvgFrom; //  = 0;
  pauseAvgTo; //  = 10000;
  pauseDurFrom; //  = 0;
  pauseDurTo; //  = 10000;
  callfrom;
  callto;
  page; //  = 0;
  batchid; // = 1;
  stopwordLooking;
  batchidAll = true;
  datefromAll = true;
  datetoAll = true;
  angerfromAll = true;
  angertoAll = true;
  pausefromAll = true;
  pausetoAll = true;
  stopOnly = false;
  tagsOnly = false;
  missingOnly = false;
  favoriteOnly = false;
  filename = "";
  paginationNum = 100;
  dateVisible = true;
  keywordsContain = [];
  keywordsNotContain = [];
  tagsContain = [];
  isKeywordsContain = true;
  itemTags = [];
  isLoadingSpinner = false;

  datePickerFromOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    // minDate: new Date(Date.now()), // Minimal selectable date
    // maxDate: new Date(Date.now()),  // Maximal selectable date
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
    // minDate: new Date(Date.now()), // Minimal selectable date
    // maxDate: new Date(Date.now()),  // Maximal selectable date
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

  constructor(
    private filesService: FilesService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: BsModalService,
    private analyticsService: AnalyticsService,
  ) {}

  ngOnInit() {
    this.sub = this.route.data.subscribe(v => {
      this.router.navigateByUrl("/user/files");
    });
    const key = this.filesService.getKeyWord();
    if (key && key !== '') {
      this.keywordsContain = [{ value: key, display: key }];
      this.filterIt();
    }
    this.filter = this.filesService.getFilter();
    this.setFilterOptions();

    this.filesService.files.subscribe((res) => {
      this.isLoadingSpinner = false;
      if (res && res.files) {
        this.isLoading = false;
      }
      if (!res || res.totalcount === 0) {
        this.isLoading = false;
        this.files = [];
        return;
      }
      this.totalCount = res.totalcount;
      this.pagesArr = Array.from(
        { length: Math.ceil(res.totalcount / 100) },
        (v, k) => k + 1
      );
      this.files = res.files;
    })
  }
  ngAfterViewInit() {
    this.filterIt();
  }

  setFilterOptions() {
    let sortName;
    switch (this.filter.sortby) {
      case "Name":
        sortName = "name";
        break;
      case "Uploaded":
        sortName = "uploaded";
        break;
      case "Duration":
        sortName = "duration";
        break;
      case "Emotion":
        sortName = "emotion";
        break;
      case "BatchId":
        sortName = "batchId";
        break;
      case "Stopwords":
        sortName = "stopWords";
        break;
      case "Compliance":
        sortName = "compliance";
        break;
      case "AvgPause":
        sortName = "avgpause";
        break;
      case "PauseDur":
        sortName = "pausedur";
        break;

      default:
        break;
    }
    this.sortBy = sortName;
    this.stopwordLooking = this.filter.stopBy || 'Everywhere';
    this.sort = this.filter.sortorder === "desc" ? "up" : "down";
    this.datefrom = this.filter.datetimefrom;
    this.dateto = this.filter.datetimeto;
    this.angerfrom = this.filter.angervolfrom;
    this.angerto = this.filter.angervolto;
    this.pauseAvgFrom = this.filter.pauseAvgFrom;
    this.pauseAvgTo = this.filter.pauseAvgTo;
    this.pauseDurFrom = this.filter.pauseDurFrom;
    this.pauseDurTo = this.filter.pauseDurTo;
    this.batchid = this.filter.batchid;
    this.filename = this.filter.filename;
    this.callfrom = this.filter.minutesfrom;
    this.callto = this.filter.minutesto;
    this.stopOnly = this.filter.stopOnly;
    this.tagsOnly = this.filter.tagsOnly;
    this.missingOnly = this.filter.missingOnly;
    this.favoriteOnly = this.filter.favoriteOnly;
    this.keywordsContain = !this.keywordsContain.length ? this.filter["keywordsContain"] && this.filter["keywordsContain"].split(',').map(v => ({value: v, display: v})) || [] : this.keywordsContain;
    this.keywordsNotContain = this.filter["keywordsNotContain"] && this.filter["keywordsNotContain"].split(',').map(v => ({value: v, display: v})) || [];
    this.tagsContain = this.filter["tagsContain"] && this.filter["tagsContain"].split(',').map(v => ({value: v, display: v})) || [];
    this.paginationNum = this.filter.itemsn || 100;
    this.page = parseInt(this.filter.pagen);
  }

  getPage(page = 0, parameters = this.filter) {
    const params = (this.filter = {
      ...parameters,
      itemsn: `${this.paginationNum}`,
      pagen: "" + (page + 1)
    });
    this.page = page;
    this.filesService.listFilesPage(params);
  }

  getPages() {
    if (this.files && Math.ceil(this.files.length / this.paginationNum) > 1) {
      return Array.from(
        { length: Math.ceil(this.files.length / this.paginationNum) },
        (v, k) => k + 1
      );
    }
    return [];
  }
  setStopwordLooking(value: string): void {
    this.stopwordLooking = value;
  }

  getEmotionName(val) {
    return val && Object.keys(val)[0];
  }

  getEmotionValue(val) {
    return val && val[Object.keys(val)[0]] && val[Object.keys(val)[0]] + "%";
  }

  refresh() {
    this.analyticsService.trackEvent('fileList', 'refresh');
    this.getPage(this.page);
  }

  delete(batchid, filename) {
    this.analyticsService.trackEvent('fileList', 'delete');
    this.filesService
      .deleteFile({
        batchid,
        filename
      })
      .subscribe(
        res => {
          this.refresh();
        },
        e => (this.errorMessage = e.error.message)
      );
  }

  getLink(item) {
    return `/file/${encodeURIComponent(item.batchid)}/${encodeURIComponent(
      item.fileid
    )}`;
  }

  proccessFile(item, i) {
    // const params = item;
    const params = {
      batchid: item.batchid,
      filename: item.filename
    };
    this.proccessing[i] = true;
    this.filesService.processFile(params).subscribe(
      v => {
        this.proccessing[i] = false;
        this.refresh();
      },
      e => (this.errorMessage = e.error.message)
    );
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
    this.analyticsService.trackEvent('sortTable', sortBy, this.sort);
    if (sortBy !== this.sortBy) {
      this.sort = "up";
    } else {
      this.sort = this.sort === "up" ? "down" : "up";
    }
    this.sortBy = sortBy;

    let sortName = "";
    switch (sortBy) {
      case "name":
        sortName = "Name";
        break;
      case "uploaded":
        sortName = "Uploaded";
        break;
      case "duration":
        sortName = "Duration";
        break;
      case "emotion":
        sortName = "Emotion";
        break;
      case "batchId":
        sortName = "BatchId";
        break;
      case "stopWords":
        sortName = "Stopwords";
        break;
      case "compliance":
        sortName = "Compliance";
        break;
      case "avgpause":
        sortName = "AvgPause";
        break;
      case "pausedur":
        sortName = "PauseDur";
        break;

      default:
        break;
    }
    this.filter = {
      ...this.filter,
      sortby: sortName,
      sortorder: this.sort === "up" ? "desc" : "asc"
    };
    this.isLoadingSpinner = true;
    this.getPage(0, this.filter);

    this.filesService.setFilter(this.filter);
  }

  resetFilter() {
    this.analyticsService.trackEvent('sortTable', 'resetFilter');
    this.dateVisible = false;
    this.datefrom = undefined;
    this.dateto = undefined;
    setTimeout(() => (this.dateVisible = true), 0);
    this.angerfrom = null;
    this.angerto = null;
    this.keywordsContain = [];
    this.keywordsNotContain = [];
    this.tagsContain = [];
    this.pauseAvgFrom = null;
    this.pauseAvgTo = null;
    this.pauseDurFrom = null;
    this.pauseDurTo = null;
    this.callfrom = null;
    this.callto = null;
    this.page = null;
    this.batchid = null;
    this.batchidAll = true;
    this.datefromAll = true;
    this.datetoAll = true;
    this.angerfromAll = true;
    this.angertoAll = true;
    this.pausefromAll = true;
    this.pausetoAll = true;
    this.stopOnly = false;
    this.sortBy = "Everywhere";
    this.tagsOnly = false;
    this.missingOnly = false;
    this.favoriteOnly = false;
    this.filename = "";
    this.filter = {
      itemsn: "100",
      pagen: "1"
    };
    this.isLoadingSpinner = true;
    this.getPage(0, this.filter);
    this.filesService.setFilter(this.filter);
    this.cd.detectChanges();
  }

  exportCSV() {
    this.analyticsService.trackEvent('fileList', 'exportCSV');
    const params = {
      ...this.filter,
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

  filterIt() {
    this.isLoadingSpinner = true;
    if(this.filter) {
      this.filter["keywordsContain"] = null;
      this.filter["keywordsNotContain"] = null;
      this.filter["tagsContain"] = null;
    }

    this.filter = {
      ...this.filter,
      batchid: (this.batchid && "" + this.batchid) || "",
      filename: this.filename,
      datetimefrom: this.datefrom || "",
      datetimeto: this.dateto || "",
      angervolfrom: this.angerfrom == null ? '' : this.angerfrom + '',
      angervolto: this.angerto == null ? ''
        : (this.angerfrom && this.angerfrom > this.angerto ? '10000' : this.angerto + ''),
      pauseAvgFrom: this.pauseAvgFrom == null ? '' : this.pauseAvgFrom + '',
      pauseAvgTo: this.pauseAvgTo == null ? ''
        : (this.pauseAvgFrom && this.pauseAvgFrom > this.pauseAvgTo ? '10000' : this.pauseAvgTo + ''),
      pauseDurFrom: this.pauseDurFrom == null ? '' : this.pauseDurFrom + '',
      pauseDurTo: this.pauseDurTo == null ? ''
        : (this.pauseDurFrom && this.pauseDurFrom > this.pauseDurTo ? '10000' : this.pauseDurTo + ''),
      minutesfrom: this.callfrom == null ? '' : this.callfrom + '',
      minutesto: this.callto == null ? ''
        : (this.callfrom && this.callfrom > this.callto ? '10000' : this.callto + ''),
      stopOnly: this.stopOnly,
      tagsOnly: this.tagsOnly,
      missingOnly: this.missingOnly,
      favoriteOnly: this.favoriteOnly
    };
    if (this.keywordsContain && this.keywordsContain.length) {
      this.analyticsService.trackEvent('fileList', 'filter', 'keywordsContain');
      this.filter["keywordsContain"] = this.keywordsContain
        .map(v =>
          v.value
            .split(",")
            .map(v => v.trim())
            .join(",")
        )
        .join(",");
      this.filter["stopBy"] = this.stopwordLooking;
    }
    if (this.keywordsNotContain && this.keywordsNotContain.length) {
      this.analyticsService.trackEvent('fileList', 'filter', 'keywordsNotContain');
      this.filter["keywordsNotContain"] = this.keywordsNotContain
        .map(v =>
          v.value
            .split(",")
            .map(v => v.trim())
            .join(",")
        )
        .join(",");
    }
    if (this.tagsContain && this.tagsContain.length) {
      this.analyticsService.trackEvent('fileList', 'filter', 'tagsContain');
      this.filter["tagsContain"] = this.tagsContain
        .map(v =>
          v.value
            .split(",")
            .map(v => v.trim())
            .join(",")
        )
        .join(",");
    }
    Object.keys(this.filter).forEach(
      key =>
        (this.filter[key] === "" ||
          this.filter[key] === undefined ||
          this.filter[key] === null) &&
        delete this.filter[key]
    );
    Object.keys(this.filter).map(key => (this.filter[key] === undefined || this.filter[key] === "undefined") && delete this.filter[key]);
    this.filesService.setFilter(this.filter);
    this.getPage((this.filter.pagen - 1) || 0, this.filter);
  }

  t(v) {
    return LanguageService.t(v);
  }

  getFilesOnPageLabel() {
    return (this.page + 1) * 100 < this.files.length
      ? (this.page + 1) * 100
      : this.files.length;
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

  onChangeKeywords(value) {
    this.isKeywordsContain = value;
  }

  filterByBatch(batchId: string) : void {
    this.batchid = batchId;
    this.filterIt();
  }

  onItemAdd(tag: any, container) {
    let c;
    switch (container) {
      case "keywordsContain":
        c = this.keywordsContain;
        break;
      case "keywordsNotContain":
        c = this.keywordsNotContain;
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
    const index = c.findIndex(el => el.value === tagVal);
    c.splice(index, 1);
    const val = tagVal.split(",").map(v => v.trim());
    c = val.map(v =>
      c.push({
        value: v,
        display: v
      })
    );
  }

  showModal(ref, item, index) {
    this.analyticsService.trackEvent('fileList', 'showModal');
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
    this.analyticsService.trackEvent('fileList', 'hideModal');
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  saveTags() {
    this.analyticsService.trackEvent('fileList', 'saveTags');
    const tags = this.itemTags.map(v => v.value);
    if (this.files[this.currentTagEditIndex]) {
      this.files[this.currentTagEditIndex].tags = tags;
    }
    const params = {
      fileid: {
        batchid: this.editedFileItem.batchid,
        fileid: this.editedFileItem.fileid
      },
      fileinfo: {
        filename: this.editedFileItem.filename,
        comment: this.editedFileItem.comment || "",
        pin: this.editedFileItem.pin,
        tags: tags || []
      }
    };
    this.filesService.updateFileInfo(params).subscribe(
      res => {
        this.refresh();
      },
      e => (this.errorMessage = e.error.message)
    );
    this.editedFileItem = null;
    this.hideModal();
  }

  getPercent(fl) {
    return Math.floor(fl * 100);
  }

  markFavorite(item, index) {
    this.analyticsService.trackEvent('fileList', 'markFavorite');
    if (this.files && this.files[index]) {
      this.files[index].pin = !this.getBool(item.pin);
    }
    const params = {
      fileid: {
        batchid: item.batchid,
        fileid: item.fileid
      },
      fileinfo: {
        filename: item.filename,
        comment: item.comment || "",
        pin: `${!this.getBool(item.pin)}`,
        tags: item.tags || []
      }
    };
    this.filesService.updateFileInfo(params).subscribe(
      res => {
        this.refresh();
      },
      e => (this.errorMessage = e.error.message)
    );
  }

  getBool(v) {
    return v === "true";
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
