import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DashboardFileStatsService } from "../../services/file-stats.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-assessment-by-agent",
  templateUrl: "./assessment-by-agent.component.html"
})
export class AssessmentByAgentComponent implements OnInit, OnDestroy {
  topicChart: any = 0;
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
      if (data && data.totals && data.totals.checklistAvgScoreDataBatches) {
        const sorted = data.totals.checklistAvgScoreDataBatches
          .sort((a, b) => b - a)
          .slice(0, 10)
          .reverse();
        var dataShadow = [];
        let yMax = 0;
        sorted.forEach(v => {
          if (v.value > yMax) {
            yMax = v.value;
          }
        });
        for (var i = 0; i < sorted.length; i++) {
          dataShadow.push(yMax);
        }
        this.topicChart = {
          color: [this.primaryColor],
          legend: {
            data: ["Agent"]
          },
          yAxis: {
            type: "category",
            name: this.t("Assessment"),
            data: data.totals.batchesnames,
            axisLabel: {
              inside: true,
              textStyle: {
                color: "#2a2a2a"
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
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#2a2a2a"
              }
            }
          },
          series: [
            {
              // For shadow
              type: "bar",
              itemStyle: {
                normal: { color: "rgba(0,0,0,0.05)" }
              },
              barGap: "-100%",
              barCategoryGap: "40%",
              data: dataShadow,
              animation: false
            },
            {
              name: "%",
              type: "bar",
              data: sorted,
              label: {
                normal: {
                  position: "right",
                  show: false
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
