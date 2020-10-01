import { Component, OnDestroy, OnInit } from "@angular/core";
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
export class StopwordsComponent implements OnInit, OnDestroy {
  autoTagChart: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  height: string = '600px';
  constructor(
    private dataService: AutoTagCloudService,
    private userData: DataService,
    private router: Router,
    private filterService: FilterService,
  ) {
    this.dataSub1 = this.dataService.data.subscribe((data) => {
      if (data && data.autotags) {
        if (this.userData.config["colors"] && this.userData.config["colors"].secondary) {
          this.primaryColor = this.userData.config["colors"].secondary;
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
    this.dataService.load('audio', null, null, []);
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
}
