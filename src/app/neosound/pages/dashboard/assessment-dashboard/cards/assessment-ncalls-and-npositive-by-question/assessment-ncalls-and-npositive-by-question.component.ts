import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChecklistStatsService} from "../../services/checklist-stats.service";
import {LanguageService} from "../../../../../services/language.service";
import {DataService} from "../../../../../shared";

@Component({
  selector: 'ngx-assessment-ncalls-and-npositive-by-question',
  templateUrl: './assessment-ncalls-and-npositive-by-question.component.html'
})
export class AssessmentNcallsAndNpositiveByQuestionComponent implements OnInit, OnDestroy {

  stats: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  colors = [
    "#c12e34",
    "#0098d9",
    "#e6b600",
    "#2b821d",
    "#005eaa",
    "#339ca8",
    "#cda819",
    "#32a487"
  ]; //shine

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
    const answeredQuestionsCountByQs = data.totals.answeredQuestionsCountByQs || {};
    const questionNamesShort = [];
    const seriesDataBar = [];
    const seriesDataLine = Object.values(data.totals.positiveAnsweredQuestionsCountByQs) || [];
    Object.keys(answeredQuestionsCountByQs).forEach(function(question){
      const qCount = answeredQuestionsCountByQs[question];
      const max_len = 20;
      const qparts = Math.ceil(question.length / max_len);
      let x = question.slice(0, max_len);
      for (let i = 1; i <= Math.min(qparts, 4); i++) {
        x += '\n' + question.slice(max_len * i, Math.min(max_len * (i + 1), question.length));
      }
      questionNamesShort.push(x);
      seriesDataBar.push(qCount);
    });
    const xAxisFontSize = 10;
    const xLabelMargin = 15;
    const xLabelRotate = 40;
    const legendData = [this.t('Stage reached'), this.t('Used script')];

    this.stats = {
      legend: {
        data: legendData
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: this.t('Times'),
          nameLocation: 'center',
          nameGap: 20
        }
      ],
      series: [
        {
          name: legendData[0],
          type: 'bar',
          barWidth: '60%',
          color: this.primaryColor,
          data: seriesDataBar
        },
        {
          name: legendData[1],
          type: 'line',
          color: this.colors[0],
          data: seriesDataLine,
        }
      ]
    };
  }

}
