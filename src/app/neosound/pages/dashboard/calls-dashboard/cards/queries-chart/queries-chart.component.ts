import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { ApiCallsStatsService } from "../../services/api-calls-stats.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-queries-chart",
  templateUrl: "./queries-chart.component.html"
})
export class QueriesChartComponent implements OnInit, OnDestroy {
  option: any = {};
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
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
  constructor(
    private dataService: ApiCallsStatsService,
    private userData: DataService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(apiRes => {
      if (apiRes && apiRes.data) {
        const legenddata = apiRes.data.legend || [];
        const seriesdata = apiRes.data.series || [];
        this.option = {
          color: this.colors,
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            show: false,
            x: "center",
            y: "bottom",
            data: legenddata
          },
          calculable: true,
          series: [
            {
              name: "API Calls",
              type: "pie",
              radius: [80, 130],
              selectedMode: "multiple",
              // center: ['50%', '40%'],
              data: seriesdata
            }
          ]
        };
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
  }
  ngOnInit() {}
  ngOnDestroy() {
    if (this.dataSub1) {
      this.dataSub1.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
}
