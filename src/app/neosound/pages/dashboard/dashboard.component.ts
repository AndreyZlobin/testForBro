import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CloudData } from "angular-tag-cloud-module";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatepickerOptions } from "ng2-datepicker";
import { FilesService } from "../../services/files.service";
import { FilterService } from "../../services/filter.service";
import { DataService } from "../../shared";
import { AnalyticsService } from "../../services/analytics.service";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../services/language.service";
import * as moment from "moment";
import { setTime } from "ngx-bootstrap/chronos/utils/date-setters";

export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487"
]; //shine

const rgbToHex = rgb => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const fullColorHex = (r, g, b) => {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red + green + blue;
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  @ViewChild("scroll") scrollTo: ElementRef;
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
  modalType: string = "calls";
  type: string = "calls";
  modalRef: BsModalRef;
  batchesCalls: string[] = [];
  batchesTexts: string[] = [];
  public selectedBatchId: string;
  public dateFrom: any;
  public dateTo: any;
  public dateFromModel: any;
  public dateToModel: any;
  public loading: boolean = true;
  constructor(
    private router: Router,
    private filesService: FilesService,
    private http: HttpClient,
    private lang: LanguageService,
    private analyticsService: AnalyticsService,
    public dataService: DataService,
    private filterService: FilterService,
    private modalService: BsModalService
  ) {}
  ngOnInit() {
    this.listCallsBatches();
    this.listTextBatches();
    this.loading = false;
  }
  listCallsBatches() {
    this.filesService.listBatches().subscribe(data => {
      if (data && data.batches) {
        this.batchesCalls = data.batches;
      }
    });
  }
  listTextBatches() {
    this.filesService.listTextBatches().subscribe(data => {
      if (data && data.batches) {
        this.batchesTexts = data.batches;
      }
    });
  }
  updateData() {
    this.hideModal();

    this.loading = true;
    this.type = this.modalType;
    if(this.dateFromModel) {
      this.dateFrom = moment(this.dateFromModel).format("YYYY-MM-DD");
    }
    if(this.dateToModel) {
      this.dateTo = moment(this.dateToModel).format("YYYY-MM-DD");
    }
    setTimeout(() => {
      this.loading = false;
    }, 10);
  }
  t(v) {
    return LanguageService.t(v);
  }
  showModal(ref, item, index) {
    this.hideModal();
    this.modalRef = this.modalService.show(ref, {});
  }

  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
