import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent {
  public users$: Observable<any>;
  public data_1 = [
    {
      name: "Operator 1",
      series: [
        {
          name: "Calls",
          value: 1521
        }
      ]
    },
    {
      name: "Operator 2",
      series: [
        {
          name: "Calls",
          value: 1612
        }
      ]
    },
    {
      name: "Operator 3",
      series: [
        {
          name: "Calls",
          value: 1326
        }
      ]
    },
    {
      name: "Operator 4",
      series: [
        {
          name: "Calls",
          value: 2800
        }
      ]
    }
  ];
  public data_2 = [
    {
      name: "Operator 1",
      series: [
        {
          name: "Minutes",
          value: 4560
        }
      ]
    },
    {
      name: "Operator 2",
      series: [
        {
          name: "Minutes",
          value: 4856
        }
      ]
    },
    {
      name: "Operator 3",
      series: [
        {
          name: "Minutes",
          value: 3924
        }
      ]
    },
    {
      name: "Operator 4",
      series: [
        {
          name: "Minutes",
          value: 3624
        }
      ]
    }
  ];
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
  roundEdges: boolean = false;
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

  constructor(private router: Router) {}

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
