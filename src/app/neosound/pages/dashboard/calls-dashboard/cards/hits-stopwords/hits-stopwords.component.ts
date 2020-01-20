import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { TagCloudService } from "../../services/tag-cloud.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-hits-stopwords",
  templateUrl: "./hits-stopwords.component.html"
})
export class HitsStopwordsComponent implements OnInit, OnDestroy {
  keyWordChart: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: TagCloudService,
    private userData: DataService
  ) {
    if (this.userData.config["colors"].secondary) {
      this.primaryColor = this.userData.config["colors"].secondary;
    } else {
      this.primaryColor = "#0098d9";
    }
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.keywords) {
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
        this.keyWordChart = {
          color: [this.primaryColor],
          grid: {
            left: 100
          },
          legend: {
            data: ["Keywords"]
          },
          yAxis: {
            type: "category",
            name: this.t("Stopwords"),
            data: sortedKeywords.map(i => i.name),
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
