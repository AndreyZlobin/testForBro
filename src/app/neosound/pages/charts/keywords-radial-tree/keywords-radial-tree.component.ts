/* tslint:disable:no-trailing-whitespace */
import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../../services/language.service';

@Component({
  selector: 'ngx-keywords-radial-tree',
  templateUrl: './keywords-radial-tree.component.html',
  styleUrls: ['./keywords-radial-tree.component.scss'],
})
export class KeywordsRadialTreeComponent implements OnInit {
  option: any = {};
  echartsInstance;

  isLoading = true;

  config = {};
  @Input('treeRadialData') treeRadialData: any;
  @Input('colors') colors: any[];

  constructor() { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.isLoading = false;
    this.initChart();
  }

  initChart() {
    this.setTotalQueries();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setTotalQueries() {
    this.option = {
      color: this.colors,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [this.treeRadialData],
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

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

}
