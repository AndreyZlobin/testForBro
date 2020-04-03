import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChecklistStatsService} from "../../services/checklist-stats.service";
import {LanguageService} from "../../../../../services/language.service";

@Component({
  selector: 'ngx-assessment-avgscore-by-agent',
  templateUrl: './assessment-avgscore-by-agent.component.html',
  styleUrls: ['./assessment-avgscore-by-agent.component.scss']
})
export class AssessmentAvgscoreByAgentComponent implements OnInit, OnDestroy {

  stats: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  // public zoomOptions = {
  //   scale: 1.3,
  //   transitionTime: 1.2,
  //   delay: 0.1
  // };

  constructor(
    private dataService: ChecklistStatsService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data) {
        this.init(data);
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

  init(data) {
    const batches = data.batches || {};
    const batchNames = [];
    const seriesData = [];
    Object.keys(batches).forEach(function (batchId) {
      batchNames.push(batchId);
      const vals = Object.values(batches[batchId].questionsScoreByQs) || [];
      const avg = Number(vals.reduce((a: number, b: number) => a + b, 0)) / vals.length || 0;
      seriesData.push(Math.round(avg * 100) / 100);
    });

    const xAxisFontSize = 12;

    this.stats = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params){
          let res = params[0].name;
          res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;' +
            'background-color:' + params[0].color + ';"></span>' +
            params[0].seriesName + ': ' + params[0].value + '%';
          return res;
        }
      },
      grid: {
        left: "3%",
        right: "2%",
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          name: 'Score, %',
          nameLocation: 'center',
          nameGap: 20
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: batchNames,
          axisLabel: {
            fontSize: xAxisFontSize,
            interval: 0
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      series: [
        {
          name: 'Score',
          type: 'bar',
          barWidth: '60%',
          data: seriesData
        }
      ]
    };
  }

}
