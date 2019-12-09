import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { ChartDataService } from "../../services/chart-data.service";

@Component({
  selector: "ngx-keywords-phrases",
  templateUrl: "./keywords-phrases.component.html"
})
export class KeywordsPhrasesComponent implements OnInit, OnDestroy {
  options: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  constructor(private dataService: ChartDataService) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data) {
        this.options = this.getOptions(data);
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
  getOptions(data: any): any {
    return {
      color: this.colors,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [data.treeRadialData],
          top: '18%',
          bottom: '14%',
          layout: 'radial',
          symbol: 'emptyCircle',
          symbolSize: 7,
          initialTreeDepth: 1,
          animationDurationUpdate: 750,
        },
      ],
    };
  }
}
