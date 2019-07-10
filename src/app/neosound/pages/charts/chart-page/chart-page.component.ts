import { Component, OnInit } from '@angular/core';
import { energy } from './mocks';
import { FilesService } from '../../../services/files.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'ngx-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.scss']
})
export class ChartPageComponent implements OnInit {
  option1: any = {};
  echartsInstance1;
  option2: any = {};
  echartsInstance2;
  option3: any = {};
  echartsInstance3;
  option4: any = {};
  echartsInstance4;
  option5: any = {};
  echartsInstance5;
  option6: any = {};
  echartsInstance6;
  option7: any = {};
  echartsInstance7;

  isLoading = true;
  fileStatLoaded = false;
  minutesStatLoaded = false;
  apiStatLoaded = false;

  fileStat: any = {};
  minutesStat: any = {};
  apiStat: any = {};

  constructor(private filesService: FilesService) { }

  ngOnInit() {
    this.filesService.getFileStats({}).subscribe(data => {
        this.fileStatLoaded = true;
        this.fileStat = data;
        this.initCharts();
    });
    this.filesService.getMinutesStats({}).subscribe(data => {
        this.minutesStatLoaded = true;
        this.minutesStat = data;
        this.initCharts();
    });
    this.filesService.getApiCallsStats({}).subscribe(data => {
        this.apiStatLoaded = true;
        this.apiStat = data;
        this.initCharts();
    });
    this.initCharts();
  }

  initCharts() {
    if (!this.fileStatLoaded || !this.minutesStatLoaded || !this.apiStatLoaded) {
        return;
    }
    this.isLoading = false;
    this.setSankey();
    this.setLine1();
    this.setWeekChart();
    this.setMinutesPerDay();
    this.setTotalQueries();
    this.setTotalMinutes();
    this.setMinutesCalm();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setSankey() {
    this.option1 = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                data: energy.nodes,
                links: energy.links,
                focusNodeAdjacency: 'allEdges',
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            }
        ]
    }
  }

  onChartInit1(ec) {
    this.echartsInstance1 = ec;
  }


  setLine1() {
    const series = this.fileStat.totals && this.fileStat.totals.countdata
        && this.fileStat.totals.countdata.series || [];
    const legenddata = this.fileStat.totals && this.fileStat.totals.legenddata || [];
    // this.fileStat.totals && this.fileStat.totals.countdata && this.fileStat.totals.countdata.series.map(v => {
    //     series.push({
    //         data: v,
    //         type: 'line',
    //         smooth: true,
    //     });
    // });
    this.option2 = {
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: false,
        containLabel: true
      },
      legend: {
        data: legenddata
      },
      xAxis: {
          type: 'category',
          data: this.fileStat.totals && this.fileStat.totals.dates || [],
      },
      yAxis: {
          type: 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          }
      },
      series: [
        {
          name: legenddata[0] || '',
          data: series[0] || [],
          type: 'line',
          smooth: true,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
        },
        {
          name: legenddata[1] || '',
          data: series[1] || [],
          type: 'line',
          smooth: true
        },
        {
          name: legenddata[2] || '',
          data: series[2] || [],
          type: 'line',
          smooth: true
        }
      ],
    };
  }

  onChartInit2(ec) {
    this.echartsInstance2 = ec;
  }

  setWeekChart() {
    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a','10a','11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'];
    var days = ['Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

    var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];

    this.option3 = {
      tooltip: {
        position: 'top'
      },
      title: [],
      singleAxis: [],
      series: []
    };

    echarts.util.each(days, (day, idx) => {
      this.option3.title.push({
        textBaseline: 'middle',
        top: (idx + 0.5) * 100 / 7 + '%',
        text: day
      });
      this.option3.singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: (idx * 100 / 7 + 5) + '%',
        height: (100 / 7 - 10) + '%',
        axisLabel: {
            interval: 2
        }
      });
      this.option3.series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: (dataItem) => {
            return dataItem[1] * 4;
        }
      });
    });

    echarts.util.each(data, (dataItem) => {
      this.option3.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });
  }

  onChartInit3(ec) {
    this.echartsInstance3 = ec;
  }

  setMinutesPerDay() {
    const series = [];
    this.minutesStat.totals && this.minutesStat.totals.durdata && this.minutesStat.totals.durdata.series.map(v => {
        series.push({
            name: 'Name',
            type: 'line',
            stack: 'stack',
            areaStyle: {},
            data: v,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
        });
    });
    this.minutesStat.totals
        && this.minutesStat.totals.legenddata.map((v, i) => {
        series[i].name = v;
    });

    this.option4 = {
      tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      legend: {
          data: this.minutesStat.totals.legenddata
      },
      grid: {
          left: '2%',
          right: '2%',
          bottom: false,
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : true,
              data : this.minutesStat.totals.dates
          }
      ],
      yAxis : [
        {
          type : 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          }
        }
      ],
      series : series
    };
  }

  onChartInit4(ec) {
    this.echartsInstance4 = ec;
  }

  setTotalQueries() {
    this.option5 = {
        //   title : {
        //       text: '南丁格尔玫瑰图',
        //       subtext: '纯属虚构',
        //       x:'center'
        //   },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              x : 'center',
              y : 'bottom',
              data: this.apiStat.data.legend,
          },
        //   toolbox: {
        //       show : true,
        //       feature : {
        //           mark : {show: true},
        //           dataView : {show: true, readOnly: false},
        //           magicType : {
        //               show: true,
        //               type: ['pie', 'funnel']
        //           },
        //           restore : {show: true},
        //           saveAsImage : {show: true}
        //       }
        //   },
          calculable : true,
          series : [
              {
                  name: this.t('API Calls'),
                  type:'pie',
                  radius : [20, 110],
                  center : ['25%', '50%'],
                  roseType : 'radius',
                  label: {
                      normal: {
                          show: false
                      },
                      emphasis: {
                          show: true
                      }
                  },
                  lableLine: {
                      normal: {
                          show: false
                      },
                      emphasis: {
                          show: true
                      }
                  },
                  data: this.apiStat.data.series,
                //   [
                //       {value:10, name:'rose1'},
                //       {value:5, name:'rose2'},
                //       {value:15, name:'rose3'},
                //       {value:25, name:'rose4'},
                //       {value:20, name:'rose5'},
                //       {value:35, name:'rose6'},
                //       {value:30, name:'rose7'},
                //       {value:40, name:'rose8'}
                //   ]
              },
            //   {
            //       name:'面积模式',
            //       type:'pie',
            //       radius : [30, 110],
            //       center : ['75%', '50%'],
            //       roseType : 'area',
            //       data:[
            //           {value:10, name:'rose1'},
            //           {value:5, name:'rose2'},
            //           {value:15, name:'rose3'},
            //           {value:25, name:'rose4'},
            //           {value:20, name:'rose5'},
            //           {value:35, name:'rose6'},
            //           {value:30, name:'rose7'},
            //           {value:40, name:'rose8'}
            //       ]
            //   }
          ]
      };
  }

  onChartInit5(ec) {
    this.echartsInstance5 = ec;
  }

  setTotalMinutes() {
    const series = [
        {
            name: this.minutesStat.totals && this.minutesStat.totals.legenddata[0],
            type: 'bar',
            stack: 'stack',
            barCategoryGap: 0,
            barGap: 0,
            barWidth: 50,
            label: {
                normal: {
                    show: true,
                    position: 'insideRight',
                },
            },
            data: [this.minutesStat.totals && this.minutesStat.totals.angerdur],
        },
        {
            name: this.minutesStat.totals && this.minutesStat.totals.legenddata[1],
            type: 'bar',
            stack: 'stack',
            barCategoryGap: 0,
            barGap: 0,
            barWidth: 50,
            label: {
                normal: {
                    show: true,
                    position: 'insideRight',
                },
            },
            data: [this.minutesStat.totals && this.minutesStat.totals.calmdur],
        },
        {
            name: this.minutesStat.totals && this.minutesStat.totals.legenddata[2],
            type: 'bar',
            stack: 'stack',
            barCategoryGap: 0,
            barGap: 0,
            barWidth: 50,
            label: {
                normal: {
                    show: true,
                    position: 'insideRight',
                },
            },
            data: [this.minutesStat.totals && this.minutesStat.totals.silentdur],
        }
    ];

    this.option6 = null;
    this.option6 = {
        backgroundColor: '#ffffff',
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            type: 'plain',
            top: '60%',
            data: this.minutesStat.totals.legenddata,
        },
        xAxis: [{
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            }
        }],
        yAxis: [{
            type: 'category',
            textStyle: {
              fontSize: 16
            },
            splitNumber: 0,
            boundaryGap: [0, 0],
            axisLabel: {
                show: false,
            },
            itemStyle: {},
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            data: [this.t('Total minutes')]
        }],
        series: series,
    };
  }

  onChartInit6(ec) {
    this.echartsInstance6 = ec;
  }

  setMinutesCalm() {
    const legendData = this.minutesStat.totals && this.minutesStat.totals.legenddata || [];
    const y_data = this.minutesStat.totals && this.minutesStat.totals.batchesnames || [];
    const _data = this.minutesStat.totals && this.minutesStat.totals.batchesdurdata || [];
    const _label = {
      normal: {
        show: true,
        position: 'inside'
      }
    };
    const minX = Math.min(..._data[0]) < 1 ? -0.5 : 0;
    this.option7 = {
        legend: {
            data: legendData
        },
        grid: {
          containLabel: true,
          left: '5%',
          // right: '5%',
          bottom: 30
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
            min: minX,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
        },
        yAxis: [{
          data: y_data,
          axisLabel: {
            show: true
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }],
        series: [{
          type: 'bar',
          name: legendData[0],
          stack: '2',
          label: _label,
          barWidth: 40,
          data: _data[0]
        }, {
          type: 'bar',
          name: legendData[1],
          stack: '2',
          barWidth: 40,
          label: _label,
          data: _data[1]
        }, {
          type: 'bar',
          stack: '2',
          name: legendData[2],
          barWidth: 40,
          label: _label,
          data: _data[2]
        }]
    };
  }

  onChartInit7(ec) {
    this.echartsInstance7 = ec;
  }

  // resizeChart() {
  //   if (this.echartsInstance) {
  //     this.echartsInstance.resize();
  //   }
  // }

}
