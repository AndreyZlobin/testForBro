import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent {
  public users$: Observable<any>;
  public data = [
    {
      name: "operaor 1",
      series: [
        {
          name: "2010",
          value: 40632
        },
        {
          name: "2000",
          value: 36953
        },
        {
          name: "1990",
          value: 31476
        }
      ]
    },
    {
      name: "operaor 2",
      series: [
        {
          name: "2010",
          value: 49737
        },
        {
          name: "2000",
          value: 45986
        },
        {
          name: "1990",
          value: 37060
        }
      ]
    },
    {
      name: "operaor 3",
      series: [
        {
          name: "2010",
          value: 36745
        },
        {
          name: "2000",
          value: 34774
        },
        {
          name: "1990",
          value: 29476
        }
      ]
    },
    {
      name: "operaor 4",
      series: [
        {
          name: "2010",
          value: 36240
        },
        {
          name: "2000",
          value: 32543
        },
        {
          name: "1990",
          value: 26424
        }
      ]
    }
  ];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = "Legend";
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = "Operator";
  showYAxisLabel = true;
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
}
