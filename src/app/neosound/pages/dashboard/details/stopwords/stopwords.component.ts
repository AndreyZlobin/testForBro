import { Component, OnInit } from "@angular/core";
import { DatepickerOptions } from "ng2-datepicker";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { LanguageService } from "../../../../services/language.service";
import { FilesService } from "../../../../services/files.service";
import { DataService } from "../../../../shared/data.service";
import { subWeeks, format } from "date-fns";

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
  selector: "app-stopwords",
  templateUrl: "./stopwords.component.html",
  styleUrls: ["./stopwords.component.scss"]
})
export class StopwordsComponent implements OnInit {
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
  colors = [
    "#c12e34",
    "#0098d9",
    "#e6b600",
    "#2b821d",
    "#005eaa",
    "#339ca8",
    "#cda819",
    "#32a487"
  ];
  rangeFirstFrom;
  rangeFirstTo;
  rangeSecondFrom;
  rangeSecondTo;
  firstData: any;
  secondData: any;
  primiryColor: any;
  isLoadingFirst: boolean = true;
  isLoadingSecond: boolean = true;
  constructor(
    private filesService: FilesService,
    private dataService: DataService
  ) {
    const today = Date.now();
    this.rangeFirstFrom = subWeeks(today, 1);
    this.rangeFirstTo = today;
    this.rangeSecondFrom = subWeeks(today, 3);
    this.rangeSecondTo = subWeeks(today, 2);
  }
  ngOnInit() {
    this.update();
  }
  t(v) {
    return LanguageService.t(v);
  }

  update() {
    this.updateFirst();
    this.updateSecond();
  }

  updateFirst() {
    this.firstData = null;
    this.isLoadingFirst = true;
    this.filesService
      .getTagClowd({
        dateFrom: this.formatDate(this.rangeFirstFrom),
        dateTo: this.formatDate(this.rangeFirstTo)
      })
      .subscribe(data => {
        if (this.dataService.config["colors"].secondary) {
          this.primiryColor = this.dataService.config["colors"].secondary;
        } else {
          this.primiryColor = "#0098d9";
        }
        const sortedKeywords = Object.keys(data.keywords)
          .map(key => {
            return {
              name: key,
              value: data.keywords[key]
            };
          })
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
          .reverse();
        this.firstData = {
          color: [this.primiryColor],
          grid: {
            left: 100
          },
          legend: {
            data: ["Keywords"]
          },
          yAxis: {
            type: "category",
            name: this.t("Stopwords"),
            data: sortedKeywords.map(i => i.name)
          },
          xAxis: {
            type: "value",
            name: this.t("Hits")
          },
          series: [
            {
              name: "%",
              type: "bar",
              data: sortedKeywords.map(i => i.value),
              label: {
                normal: {
                  position: "right",
                  show: true
                }
              }
            }
          ]
        };
        this.isLoadingFirst = false;
      });
  }
  private formatDate(date): string {
    return format(date, "yyyy-MM-dd");
  }
  updateSecond() {
    this.isLoadingSecond = true;
    this.secondData = null;
    this.filesService
      .getTagClowd({
        dateFrom: this.formatDate(this.rangeSecondFrom),
        dateTo: this.formatDate(this.rangeSecondTo)
      })
      .subscribe(data => {
        this.secondData = null;
        const sortedKeywords = Object.keys(data.keywords)
          .map(key => {
            return {
              name: key,
              value: data.keywords[key]
            };
          })
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
          .reverse();
        this.secondData = {
          color: [this.primiryColor],
          grid: {
            left: 100
          },
          legend: {
            data: ["Keywords"]
          },
          yAxis: {
            type: "category",
            name: this.t("Stopwords"),
            data: sortedKeywords.map(i => i.name)
          },
          xAxis: {
            type: "value",
            name: this.t("Hits")
          },
          series: [
            {
              name: "%",
              type: "bar",
              data: sortedKeywords.map(i => i.value),
              label: {
                normal: {
                  position: "right",
                  show: true
                }
              }
            }
          ]
        };
        this.isLoadingSecond = false;
      });
  }
}
