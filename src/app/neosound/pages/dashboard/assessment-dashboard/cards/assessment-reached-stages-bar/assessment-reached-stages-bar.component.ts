import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChecklistStatsService} from "../../services/checklist-stats.service";
import {LanguageService} from "../../../../../services/language.service";

@Component({
  selector: 'ngx-assessment-reached-stages-bar',
  templateUrl: './assessment-reached-stages-bar.component.html',
  styleUrls: ['./assessment-reached-stages-bar.component.scss']
})
export class AssessmentReachedStagesBarComponent implements OnInit, OnDestroy {

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
    const answeredQuestionsCountByQs = data.totals.answeredQuestionsCountByQs || {};
    const questionNamesShort = [];
    const tooltipNames = {};
    Object.keys(answeredQuestionsCountByQs).forEach(function(question){
      const max_len = 20;
      const qparts = Math.ceil(question.length / max_len);
      let x = question.slice(0, max_len);
      for (let i = 1; i <= Math.min(qparts, 4); i++) {
        x += '\n' + question.slice(max_len * i, Math.min(max_len * (i + 1), question.length));
      }
      tooltipNames[x] = question;
      questionNamesShort.push(x);
    });

    const batches = data.batches || {};
    const batchNames = [];
    const series = [];
    Object.keys(batches).forEach(function (batchId) {
      batchNames.push(batchId);
      const item = {
        name: batchId,
        type: 'bar',
        barGap: 0,
        label: {
          show: true,
          position: 'insideBottom',
          distance: 10,
          rotate: 90
        },
        data: Object.values(batches[batchId].answeredQuestionsCountByQs)
      };
      series.push(item);
    });

    const xAxisFontSize = 10;
    const xLabelMargin = 20;
    const xLabelRotate = 40;

    this.stats = {
      color: this.colors,
      legend: {
        data: batchNames
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
      series: series
    };
  }

}
