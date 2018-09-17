import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() data: any;

  // Chart cofiguration
  view: number[] = undefined; // [346, 200];
  chartScheme = {
    domain: [
      '#4abce2', '#ffa823', '#e54128', '#b2d11e', '#7e0d81',
    ],
  };
  explodeSlices = false;
  chartFormattedData: any = [];
  isVertical = true;
  isLegend = true;
  inProgress = true;
  animations = false;

  constructor() { }

  ngOnInit() {
  }

  onClick($event) {

  }

}
