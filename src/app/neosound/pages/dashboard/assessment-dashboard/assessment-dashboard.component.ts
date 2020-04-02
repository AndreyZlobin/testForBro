import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {FilesService} from "../../../services/files.service";
import * as moment from "moment";
import {LanguageService} from "../../../services/language.service";
import {ChecklistStatsService} from "./services/checklist-stats.service";

/*export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487"
]; //shine*/

/*const rgbToHex = rgb => {
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
};*/

@Component({
  selector: 'ngx-assessment-dashboard',
  templateUrl: './assessment-dashboard.component.html',
  styleUrls: ['./assessment-dashboard.component.scss']
})
export class AssessmentDashboardComponent implements OnInit, OnChanges {

  selectedValue;
  modalRef: BsModalRef;
  batchesCalls: string[] = [];
  public batches: string[] = [];
  public selectedBatches: string[] = [];
  public dateFrom: any;
  public dateTo: any;
  public dateModel: any = [];
  public loading: boolean = true;

  constructor(
    private filesService: FilesService,
    private checklistStatsService: ChecklistStatsService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.listCallsBatches();
    this.loadData('', '', []);
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    const params = {};
    if (changes.dateFrom.currentValue) {
      params["dateFrom"] = changes.dateFrom.currentValue;
    }
    if (changes.dateFrom.currentValue) {
      params["dateTo"] = changes.dateTo.currentValue;
    }
    if (changes.batches.currentValue) {
      params["batches"] = changes.batches.currentValue;
    }
    this.loadData(params["dateFrom"], params["dateTo"], params["batches"]);
  }

  loadData(dateFrom, dateTo, batches) {
    this.checklistStatsService.load(dateFrom, dateTo, batches);
  }

  listCallsBatches() {
    this.filesService.listBatches().subscribe(data => {
      if (data && data.batches) {
        this.loading = false;
        this.batchesCalls = data.batches;
      }
    });
  }

  updateData() {
    this.hideModal();
    this.loading = true;
    // this.type = this.modalType;
    if (this.selectedBatches) {
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

  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
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

  show(name: string) {
    return true;
    // return this.settings && this.settings[name] && this.settings[name].show
  }
}
