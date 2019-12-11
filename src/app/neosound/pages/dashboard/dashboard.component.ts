import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatepickerOptions } from "ng2-datepicker";
import { FilesService } from "../../services/files.service";
import { FilterService } from "../../services/filter.service";
import { DataService } from "../../shared";
import { AnalyticsService } from "../../services/analytics.service";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../services/language.service";
import * as moment from "moment";

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
  selectedValue;
  modalType: string = "calls";
  type: string = "calls";
  modalRef: BsModalRef;
  batchesCalls: string[] = [];
  batchesTexts: string[] = [];
  public batches: string[] = [];
  public settingsCalls = { whitelist: []};
  public settingsTexts = { whitelist: []};
  public selectedBatches: string[] = [];
  public dateFrom: any;
  public dateTo: any;
  public dateModel: any = [];
  public loading: boolean = true;
  constructor(
    private filesService: FilesService,
    public dataService: DataService,
    private modalService: BsModalService
  ) {}
  ngOnInit() {
    this.listCallsBatches();
    this.listTextBatches();
  }

  listCallsBatches() {
    this.filesService.listBatches().subscribe(data => {
      if (data && data.batches) {
        this.loading = false;
        this.batchesCalls = data.batches;
      }
    });
  }
  listTextBatches() {
    this.filesService.listTextBatches().subscribe(data => {
      if (data && data.batches) {
        this.loading = false;
        this.batchesTexts = data.batches;
      }
    });
  }


  updateData() {
    this.hideModal();

    this.loading = true;
    this.type = this.modalType;
    if(this.selectedBatches) {
      this.batches = this.selectedBatches;
    }
    if (this.dateModel && this.dateModel[0]) {
      this.dateFrom = moment(this.dateModel[0]).format("YYYY-MM-DD");
    }  else {
      this.dateFrom = null;
    }
    if (this.dateModel && this.dateModel[1]) {
      this.dateTo = moment(this.dateModel[1]).format("YYYY-MM-DD");
    } else {
      this.dateTo = null;
    }
    setTimeout(() => {
      this.loading = false;
    }, 10);
  }
  reset() {
    this.batches = [];
    this.dateModel = null;
  }

  t(v) {
    return LanguageService.t(v);
  }
  showModal(ref, item, index) {
    this.hideModal();
    this.modalRef = this.modalService.show(ref, {});
  }
  switchTabs(tabName) {
    this.modalType = tabName;
    this.selectedBatches = [];
    this.batches = [];
    this.selectedValue = '';
  }
  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  lastMonth() {
    this.dateModel[0] = moment().subtract(1, 'weeks').startOf('isoWeek')
    this.dateModel[0] = moment().subtract(1, 'weeks').endOf('isoWeek')
  }

  lastWeek() {
    this.dateModel[0] = moment().subtract(1, 'month').startOf('isoWeek')
    this.dateModel[0] = moment().subtract(1, 'month').endOf('isoWeek')
  }

  onSelect(tag: any) {
    this.selectedValue = '';
    const deduplicate = new Set([
      ...this.selectedBatches,
      tag.value
    ]);
    this.selectedBatches = Array.from(deduplicate);
  }

  onRemove(tag: string) {
    this.selectedBatches = this.selectedBatches.filter(id => id !== tag);
  }
}
