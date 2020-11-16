import { IFilterData } from './../../shared/data.service';
import { UtilsService } from './../../shared/utils.service';
import { takeUntil, tap } from 'rxjs/operators';
import { AutoTagCloudService } from './calls-dashboard/services/auto-tag-cloud.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilesService } from "../../services/files.service";
import { DataService } from "../../shared";
import { LanguageService } from "../../services/language.service";
import * as moment from "moment";
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
export class DashboardComponent implements OnInit, OnDestroy {
  selectedValue;
  modalType: string = "calls";
  type: string = "calls";
  modalRef: BsModalRef;
  batchesCalls: string[] = [];
  batchesTexts: string[] = [];
  protected readonly _unsubscribe$: Subject<void> = new Subject<void>();
  protected batches: string[] = [];
  protected settingsCalls = { whitelist: []};
  protected settingsTexts = { whitelist: []};
  protected selectedBatches: string[] = [];
  protected dateFrom: any;
  protected dateTo: any;
  protected dateModel: any = [];
  protected loading: boolean = true;
  constructor(
    protected filesService: FilesService,
    protected dataService: DataService,
    protected modalService: BsModalService,
    protected autoTagCloudService: AutoTagCloudService,
    protected utils: UtilsService,
  ) {
    this.dataService.filterData$.pipe(
      tap((filterData: IFilterData) => {
        this.selectedBatches = filterData.batches;
        this.dateFrom = filterData.dateFrom;
        this.dateTo = filterData.dateTo;
        this.dateModel = filterData.dateModel;
        this.dataService.loadData(filterData);
      }),
      takeUntil(this._unsubscribe$),
    ).subscribe();
  }

  ngOnInit() {
    this.listCallsBatches();
    this.listTextBatches();
  }

  ngOnDestroy(): void {
    this.utils.stopSubscriptions(this._unsubscribe$);
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

    const payload = {
      batches: this.batches,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      dateModel: this.dateModel,
    };

    this.dataService.filterData = payload;

    setTimeout(() => {
      this.loading = false;
    }, 10);
  }
  reset() {
    this.batches = [];
    this.selectedBatches = [];
    this.dateFrom = null;
    this.dateTo = null;
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
