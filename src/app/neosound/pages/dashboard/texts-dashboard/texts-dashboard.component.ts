import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Router } from "@angular/router";
import { CloudData } from "angular-tag-cloud-module";
import { frLocale, BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatepickerOptions } from "ng2-datepicker";
import { FilesService } from "../../../services/files.service";
import { FilterService } from "../../../services/filter.service";
import { DataService } from "../../../shared";
import { AnalyticsService } from "../../../services/analytics.service";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "../../../services/language.service";

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
  selector: "app-texts-dashboard",
  templateUrl: "./texts-dashboard.component.html",
  styleUrls: ["./texts-dashboard.component.scss"]
})
export class TextsDashboardComponent implements OnInit, OnChanges {
  @Input() dateFrom: string;
  @Input() dateTo: string;
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
  loading: boolean = true;
  colors: string[] = [];
  primiryColor: string = "#3399cc";

  options: any = {};
  options2: any = {};
  public totals = {};
  public barChart: any;
  fileStat: any = {};
  filesCount: any;
  batchCount: any;
  apiStat: any = {};
  apiCalls: any;
  hasData: boolean = false;
  stopwords: any;
  byDay: any;
  keyWordChart: any;
  public zoomOPtions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private router: Router,
    private filesService: FilesService,
    private http: HttpClient,
    private lang: LanguageService,
    private analyticsService: AnalyticsService,
    public dataService: DataService,
    private filterService: FilterService,
    private modalService: BsModalService
  ) {
    this.setColors();
  }

  setColors() {
    this.colors = colors;
  }
  ngOnInit() {
    if (this.dataService.config["colors"].secondary) {
      this.primiryColor = this.dataService.config["colors"].secondary;
    } else {
      this.primiryColor = "#0098d9";
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    const params = {
      source: "emails"
    };
    if (changes.dateFrom.currentValue) {
      params["dateFrom"] = changes.dateFrom.currentValue;
    }
    if (changes.dateFrom.currentValue) {
      params["dateTo"] = changes.dateTo.currentValue;
    }
    this.getTextStats(params);
    this.getApiCallsStats(params);
    this.getTextStopwords(params);
    this.loading = true;
  }
  private getRadius(r, minR, maxR) {
    if (r === minR) {
      return 20;
    } else if (r === maxR) {
      return 40;
    } else {
      return Math.floor(20 + (40 * r) / maxR);
    }
  }
  public logout() {
    this.router.navigateByUrl("/");
  }
  public getTotal(data: any[]): number {
    return data.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        currentValue.series.reduce((acc, cur) => {
          return acc + cur.value;
        }, 0)
      );
    }, 0);
  }
  username() {
    const data = localStorage.getItem("user");
    const user = data && JSON.parse(data);
    return data && user && user.username;
  }
  keywordClicked(clicked: CloudData) {
    this.analyticsService.trackEvent("user", "keywordClicked");
    this.filterService.filter.keywordsContain = [
      { display: clicked.text, value: clicked.text }
    ];
    this.router.navigateByUrl("/user/files");
  }

  t(v) {
    return LanguageService.t(v);
  }

  isEnglish() {
    return this.lang.checkLanguage("en");
  }

  isSpanish() {
    return this.lang.checkLanguage("sp");
  }
  isRussian() {
    return this.lang.checkLanguage("ru");
  }

  getColor(i) {
    return colors[i];
  }

  getTextStats(param: any = {}) {
    this.filesService.getTextStats(param).subscribe(data => {
      if (data && data.totals) {
        this.filesCount = data.totals.filesCount;
        this.batchCount = data.totals.batchCount;
        this.loading = false;
        this.fileStat = data;
        this.loading = false;
        const batches = Object.keys(data.batches);
        const files = [];
        if (batches) {
          this.hasData = true;
          batches
            .sort(
              (a, b) =>
                data.batches[b]
                  .filesCount /*+ data.batches[a].angerCallsN + data.batches[a].silentCallsN*/ -
                data.batches[a]
                  .filesCount /* + data.batches[b].angerCallsN + data.batches[b].silentCallsN*/
            )
            .slice(0, 6)
            .reverse()
            .forEach(batchName => {
              files.push(data.batches[batchName].filesCount);
            });
          const chartData = [
            {
              name: this.t("files"),
              type: "bar",
              data: files
            }
          ];

          this.barChart = {
            color: this.primiryColor,
            grid: {
              left: 100
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: batches
            },
            yAxis: {
              type: "category",
              axisTick: { show: false },
              data: batches.slice(0, 6).reverse()
            },
            xAxis: {
              type: "value",
              name: this.t("Files"),
              nameLocation: "middle",
              nameGap: 30,
              min: 0
            },
            series: chartData
          };
          const series = [];
          data.totals.countData.series.map(v => {
            series.push({
              name: "Name",
              type: "line",
              stack: "stack",
              areaStyle: {},
              data: v,
              label: {
                normal: {
                  show: true,
                  position: "top"
                }
              }
            });
          });
          this.byDay = {
            color: this.primiryColor,
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985"
                }
              }
            },
            grid: {
              left: "2%",
              right: "2%",
              bottom: false,
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: true,
                data: data.totals && data.totals.dates
              }
            ],
            yAxis: [
              {
                type: "value",
                axisLabel: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false
                }
              }
            ],
            series: series
          };
        }
      }
    });
  }
  getApiCallsStats(param: any = {}) {
    this.filesService.getApiCallsStats(param).subscribe(data => {
      this.apiCalls = data.apiCallsCount;
      this.apiStat = data;
    });
  }
  getTextStopwords(param: any = {}) {
    this.filesService.getTextStopwords(param).subscribe(data => {
      this.stopwords = Object.keys(data.keywords).map(key => {
        return {
          text: key,
          weight: data.keywords[key]
        };
      });
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
      if (this.dataService.config["colors"].secondary) {
        this.primiryColor = this.dataService.config["colors"].secondary;
      } else {
        this.primiryColor = "#0098d9";
      }
      this.keyWordChart = {
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
    });
  }
}
