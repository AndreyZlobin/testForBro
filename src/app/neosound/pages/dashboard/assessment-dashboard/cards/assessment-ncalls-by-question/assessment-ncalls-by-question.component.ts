import {Component, OnDestroy, OnInit} from '@angular/core';
import {LanguageService} from "../../../../../services/language.service";
import {ChecklistStatsService} from "../../services/checklist-stats.service";

@Component({
  selector: 'ngx-assessment-ncalls-by-question',
  templateUrl: './assessment-ncalls-by-question.component.html'
})
export class AssessmentNcallsByQuestionComponent implements OnInit, OnDestroy {

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
    const answeredQuestionsCountByQs = data.totals.answeredQuestionsCountByQs || {};
    const questionNamesShort = [];
    const tooltipNames = {};
    const seriesData = [];
    Object.keys(answeredQuestionsCountByQs).forEach(function(question){
      const qCount = answeredQuestionsCountByQs[question];
      const max_len = 20;
      const qparts = Math.ceil(question.length / max_len);
      let x = question.slice(0, max_len);
      for (let i = 1; i <= Math.min(qparts, 4); i++) {
        x += '\n' + question.slice(max_len * i, Math.min(max_len * (i + 1), question.length));
      }
      // x += '\n' + question.slice(max_len, max_len * 2) +
      //      '\n' + question.slice(max_len * 2, max_len * 3);
      // if (question.length > max_len * 3) {
      //   x += '\n...';
      // }
      tooltipNames[x] = question;
      questionNamesShort.push(x);
      seriesData.push(qCount);
    });
    const xAxisFontSize = 10;
    const xLabelMargin = 20;
    const xLabelRotate = 40;

    this.stats = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params){
          let res = tooltipNames[params[0].name];
          res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;' +
            'background-color:' + params[0].color + ';"></span>' +
            params[0].seriesName + ': ' + params[0].value;
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
            margin: xLabelMargin
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'times',
          nameLocation: 'center'
        }
      ],
      series: [
        {
          name: 'times',
          type: 'bar',
          barWidth: '60%',
          data: seriesData
        }
      ]
    };
  }

}
