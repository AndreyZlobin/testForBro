import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChecklistStatsService} from "../../services/checklist-stats.service";
import {LanguageService} from "../../../../../services/language.service";
import {DataService} from "../../../../../shared";

@Component({
  selector: 'ngx-assessment-avgscore-by-agent',
  templateUrl: './assessment-avgscore-by-agent.component.html'
})
export class AssessmentAvgscoreByAgentComponent implements OnInit, OnDestroy {

  stats: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  // public zoomOptions = {
  //   scale: 1.3,
  //   transitionTime: 1.2,
  //   delay: 0.1
  // };

  constructor(
    private dataService: ChecklistStatsService,
    private userData: DataService,
  ) {
    if (this.userData.config["colors"].secondary) {
      this.primaryColor = this.userData.config["colors"].secondary;
    } else {
      this.primaryColor = "#0098d9";
    }
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

    const sorted = Object.keys(batches)
      .map(batchId => {
        const vals = Object.values(batches[batchId].questionsScoreByQs) || [];
        const avg = Number(vals.reduce((a: number, b: number) => a + b, 0)) / vals.length || 0;
        return {
          name: batchId,
          value: Math.round(avg * 100) / 100
        };
      })
      .sort((a, b) => b.value - a.value)
      // .slice(0, 10)
      .reverse();
    sorted.forEach(function (el) {
      batchNames.push(el.name);
      seriesData.push(el.value);
    });

    const xAxisFontSize = 12;

    this.stats = {
      color: [this.primaryColor],
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
          name: this.t('Score, %'),
          nameLocation: 'center',
          nameGap: 20
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: batchNames,
          axisLabel: {
            show: false
            // fontSize: xAxisFontSize,
            // interval: 0
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      series: [
        {
          name: this.t('Score'),
          type: 'bar',
          barWidth: '60%',
          data: seriesData,
          label: {
            show: true,
            position: 'insideLeft',
            formatter: '{b}'
          }
        }
      ]
    };
  }

}
