import { tap, takeUntil } from 'rxjs/operators';
import { UtilsService } from './../../../../shared/utils.service';
import { FilesService } from './../../../../services/files.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DashboardComponent } from './../../dashboard.component';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from "../../../../shared";
import { LanguageService } from "../../../../services/language.service";
import { AutoTagCloudService } from "../../../dashboard/calls-dashboard/services/auto-tag-cloud.service";
import { Router } from "@angular/router";
import { FilterService } from "../../../../services/filter.service";

export const colors = [
  "#c12e34",
  "#0098d9",
  "#e6b600",
  "#2b821d",
  "#005eaa",
  "#339ca8",
  "#cda819",
  "#32a487",
]; //shine

const rgbToHex = (rgb) => {
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
  selector: "app-stopwords",
  templateUrl: "./stopwords.component.html",
  styleUrls: ["./stopwords.component.scss"],
})
export class StopwordsComponent extends DashboardComponent implements OnInit, OnDestroy {

  autoTagChart: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  height: string = '600px';
  constructor(
    protected autoTagCloudService: AutoTagCloudService,
    protected dataService: DataService,
    protected router: Router,
    protected filterService: FilterService,
    protected modalService: BsModalService,
    protected filesService: FilesService,
    protected utils: UtilsService,
  ) {
    super(
      filesService,
      dataService,
      modalService,
      autoTagCloudService,
      utils,
    );
    this.dataService.filterData$.pipe(
      tap((filterData) => {
        this.dateModel = filterData.dateModel;
        this.dataService.loadData(filterData);
      }),
      takeUntil(this._unsubscribe$),
    ).subscribe();
    this.dataSub1 = this.autoTagCloudService.data.subscribe((data) => {
      if (data && data.autotags) {
        if (this.dataService.config["colors"] && this.dataService.config["colors"].secondary) {
          this.primaryColor = this.dataService.config["colors"].secondary;
        } else {
          this.primaryColor = "#0098d9";
        }
        const sortedKeywords = Object.keys(data.autotags)
          .map((key) => {
            return {
              name: key,
              value: data.autotags[key],
            };
          })
          .sort((a, b) => b.value - a.value)
          .reverse();
        this.height = 200 + 40 * sortedKeywords.length + 'px';
        this.autoTagChart = {
          color: [this.primaryColor],
          grid: {
            left: 200,
            right: 50,
          },
          legend: {
            data: ["Categories"],
          },
          yAxis: {
            type: "category",
            data: sortedKeywords.map((i) => i.name),
            nameLocation: 'center',
            nameRotate: '90',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            z: 10,
          },

          xAxis: {
            type: "value",
            name: this.t("Hits"),
            nameLocation: 'center',
          },
          series: [
            {
              name: "%",
              type: "bar",
              data: sortedKeywords.map((i) => i.value),
              label: {
                normal: {
                  position: "right",
                  show: true,
                },
              },
            },
          ],
        };
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
  }

  ngOnInit() {
    this.listCallsBatches();
    this.listTextBatches();
  }

  ngOnDestroy() {
    if (this.dataSub1) {
      this.dataSub1.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  getColor(i: number): string {
    const colors = [
      "#c12e34",
      "#0098d9",
      "#e6b600",
      "#2b821d",
      "#005eaa",
      "#339ca8",
      "#cda819",
      "#32a487",
    ];
    return colors[i];
  }
  print() {
    window.print();
  }
  onChartEvent(event: any) {
    this.filterService.filter.tagsContain = [{ display: event.name, value: event.name }];;
    this.router.navigateByUrl("/user/files");
  }

  updateData() {
    super.updateData();
  }

  resetFilter() {
    super.reset();
    super.updateData();
  }
}
