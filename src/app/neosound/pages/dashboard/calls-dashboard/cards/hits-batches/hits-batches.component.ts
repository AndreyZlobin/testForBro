import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../../../../shared";
import {LanguageService} from "../../../../../services/language.service";
import {DashboardFileStatsService} from "../../services/file-stats.service";

@Component({
  selector: 'ngx-hits-batches',
  templateUrl: './hits-batches.component.html'
})
export class HitsBatchesComponent implements OnInit, OnDestroy {
  agentChart: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: DashboardFileStatsService,
    private userData: DataService
  ) {
    if (this.userData.config["colors"].secondary) {
      this.primaryColor = this.userData.config["colors"].secondary;
    } else {
      this.primaryColor = "#0098d9";
    }
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.batches) {
        const sortedBatches = Object.keys(data.batches)
          .map(key => {
            return {
              name: key,
              value: data.batches[key].allCallsN
            };
          })
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
          .reverse();
        this.agentChart = {
          color: [this.primaryColor],

          legend: {
            data: ["Calls"]
          },
          yAxis: {
            type: "category",
            name: this.t("Calls"),
            data: sortedBatches.map(i => i.name),
            axisLabel: {
              inside: true,
              textStyle: {
                color: "#ffffff"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          xAxis: {
            type: "value",
            name: this.t("Hits")
          },
          series: [
            {
              name: "%",
              type: "bar",
              data: sortedBatches.map(i => i.value),
              label: {
                normal: {
                  position: "right",
                  show: true
                }
              }
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
  getColor(i: number): string {
    const colors = [
      "#c12e34",
      "#0098d9",
      "#e6b600",
      "#2b821d",
      "#005eaa",
      "#339ca8",
      "#cda819",
      "#32a487"
    ];
    return colors[i];
  }
}
