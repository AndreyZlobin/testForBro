import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChecklistStatsService} from "../../services/checklist-stats.service";
import {LanguageService} from "../../../../../services/language.service";

@Component({
  selector: 'ngx-assessment-avgscore-by-agent-question-bar-stacked',
  templateUrl: './assessment-avgscore-by-agent-question-bar-stacked.component.html'
})
export class AssessmentAvgscoreByAgentQuestionBarStackedComponent implements OnInit, OnDestroy {

  stats: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  colors = [
    "#0098d9",
    "#c12e34",
    "#e6b600",
    "#2b821d",
    "#005eaa",
    "#339ca8",
    "#cda819",
    "#32a487"
  ]; //shine

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
    const questionsScoreByQs = data.totals.questionsScoreByQs || {};
    const questionNamesShort = [];
    Object.keys(questionsScoreByQs).forEach(function(question){
      const max_len = 20;
      const qparts = Math.ceil(question.length / max_len);
      let x = question.slice(0, max_len);
      for (let i = 1; i <= Math.min(qparts, 4); i++) {
        x += '\n' + question.slice(max_len * i, Math.min(max_len * (i + 1), question.length));
      }
      questionNamesShort.push(x);
    });

    const batches = data.batches || {};
    const batchNames = [];
    const series = [];
    Object.keys(batches).forEach(function (batchId) {
      batchNames.push(batchId);
      const item = {
        name: batchId,
        type: 'line',
        stack: 'stack',
        areaStyle: {},
        data: Object.values(batches[batchId].questionsScoreByQs)
      };
      series.push(item);
    });

    const xAxisFontSize = 10;
    const xLabelMargin = 15;
    const xLabelRotate = 40;

    this.stats = {
      color: this.colors,
      legend: {
        data: batchNames
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        formatter: function(params){
          let res = params[0].name;
          const max_len = 40;
          const qparts = Math.ceil(res.length / max_len);
          let x = res.slice(0, max_len);
          for (let i = 1; i <= Math.min(qparts, 4); i++) {
            x += '<br/>' + res.slice(max_len * i, Math.min(max_len * (i + 1), res.length));
          }
          res = x;
          params.forEach(function (param) {
            res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;' +
              'background-color:' + param.color + ';"></span>' +
              param.seriesName + ': ' + param.value;
          });
          return res;
        }
      },
      grid: {
        left: "3%",
        right: "2%",
        bottom: false,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: questionNamesShort,
          axisLabel: {
            fontSize: xAxisFontSize,
            interval: 0,
            rotate: xLabelRotate,
            margin: xLabelMargin,
            padding: [xLabelMargin,0,0,0]
          },
          axisTick: {
            alignWithLabel: true
          },
          // boundaryGap: false,
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: this.t('Score, %'),
          nameLocation: 'center',
          nameGap: 30
        }
      ],
      series: series
    };
  }

}
