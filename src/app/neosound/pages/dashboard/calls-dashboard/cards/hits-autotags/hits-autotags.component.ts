import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../../../../shared";
import {LanguageService} from "../../../../../services/language.service";
import {AutoTagCloudService} from "../../services/auto-tag-cloud.service";
import { Router } from '@angular/router';
import { FilterService } from '../../../../../services/filter.service';

@Component({
  selector: 'ngx-hits-autotags',
  templateUrl: './hits-autotags.component.html'
})
export class HitsAutotagsComponent implements OnInit, OnDestroy {
  autoTagChart: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: AutoTagCloudService,
    private userData: DataService,
    private router: Router,
    private filterService: FilterService,
  ) {
    if (this.userData.config["colors"].secondary) {
      this.primaryColor = this.userData.config["colors"].secondary;
    } else {
      this.primaryColor = "#0098d9";
    }
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.autotags) {
        const sortedKeywords = Object.keys(data.autotags)
          .map(key => {
            return {
              name: key,
              value: data.autotags[key]
            };
          })
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
          .reverse();
        this.autoTagChart = {
          color: [this.primaryColor],

          legend: {
            data: ["Categories"]
          },
          yAxis: {
            type: "category",
            data: sortedKeywords.map(i => i.name),
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
  onChartEvent(event: any) {
    this.filterService.filter.tagsContain = [{ display: event.name, value: event.name }];;
    this.router.navigateByUrl("/user/files");
  }
}
