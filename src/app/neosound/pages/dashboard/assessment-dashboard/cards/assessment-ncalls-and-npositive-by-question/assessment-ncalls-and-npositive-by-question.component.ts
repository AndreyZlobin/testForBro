import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChecklistStatsService} from "../../services/checklist-stats.service";
import {LanguageService} from "../../../../../services/language.service";
import {DataService} from "../../../../../shared";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'ngx-assessment-ncalls-and-npositive-by-question',
  templateUrl: './assessment-ncalls-and-npositive-by-question.component.html',
  styleUrls: ['./assessment-ncalls-and-npositive-by-question.component.scss']
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
    const tooltipNames = {};
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
      // x += '\n' + question.slice(max_len, max_len * 2) +
      //      '\n' + question.slice(max_len * 2, max_len * 3);
      // if (question.length > max_len * 3) {
      //   x += '\n...';
      // }
      tooltipNames[x] = question;
      questionNamesShort.push(x);
      seriesDataBar.push(qCount);
    });
    const xAxisFontSize = 10;
    const xLabelMargin = 20;
    const xLabelRotate = 40;
    const legendData = ['Stage reached', 'Used script'];

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
          let res = tooltipNames[params[0].name];
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
