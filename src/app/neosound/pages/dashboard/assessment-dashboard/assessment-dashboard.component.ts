import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {Component, OnInit} from '@angular/core';
import {FilesService} from "../../../services/files.service";
import * as moment from "moment";
import {LanguageService} from "../../../services/language.service";
import {ChecklistStatsService} from "./services/checklist-stats.service";

@Component({
  selector: 'ngx-assessment-dashboard',
  templateUrl: './assessment-dashboard.component.html'
})
export class AssessmentDashboardComponent implements OnInit {

  selectedValue;
  modalRef: BsModalRef;
  batchesCalls: string[] = [];
  public batches: string[] = [];
  public selectedBatches: string[] = [];
  public dateFrom: any;
  public dateTo: any;
  public dateModel: any = [];
  public loading: boolean = true;
  settings: any = {};

  constructor(
    private filesService: FilesService,
    private checklistStatsService: ChecklistStatsService,
    private modalService: BsModalService
  ) {
    this.settings = JSON.parse(localStorage.getItem("settings")).dashboardcards;
  }

  ngOnInit() {
    this.listCallsBatches();
    this.loadData('', '', []);
    this.loading = false;
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
      this.loadData(this.dateFrom, this.dateTo, this.batches);
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
    return this.settings && this.settings[name] && this.settings[name].show;
  }
}
