import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, TimeoutError } from "rxjs";

import { FilesService } from "../../services/files.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public users$: Observable<any>;
  public barches = [];
  public totals = {};
  public data_2 = [];
  public loading = true;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  legendTitle = "Legend";
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = "Operator";
  showYAxisLabel = false;
  yAxisLabel = "Number Of Calls";
  showGridLines = true;
  innerPadding = "10%";
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = false;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;
  legendPosition = "below";
  colorScheme = {
    name: "custom",
    selectable: true,
    group: "custom",
    domain: [
      "#009AD2",
      "#E36B68",
      "#00A576",
      "#8661B3",
      "#9C4995",
      "#A72F71",
      "#E86765",
      "#EB9A28",
      "#EB9A28",
      "#F9F871",
      "#6677C7"
    ]
  };

  constructor(private router: Router, private filesService: FilesService) {}
  ngOnInit() {
    this.filesService.getFileStats({}).subscribe(data => {
      this.loading = false;
      const batches = Object.keys(data.batches);
      if (batches) {
        const chartData = batches.map(batchName => {
          return {
            name: batchName,
            series: [
              {
                name: "All Calls",
                value: data.batches[batchName].allCallsN
              },
              {
                name: "Anger Calls",
                value: data.batches[batchName].angerCallsN
              },
              {
                name: "Silent Calls",
                value: data.batches[batchName].silentCallsN
              }
            ]
          };
        });
        // this.barches = chartData;
        // this.totals = data.totals;
      }
    });
  }

  public loadData() {}

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
}
