import { Component, OnInit } from '@angular/core';
import { energy } from './mocks';

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

  constructor() { }

  ngOnInit() {
    this.setSankey();
    this.setLine1();
    this.setWeekChart();
    this.setMinutesPerDay();
    this.setTotalQueries();
    this.setTotalMinutes();
    this.setMinutesCalm();
  }

  setSankey() {
    this.option1 = {
        title: {
            text: 'Sankey Diagram'
        },
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
    this.option2 = {
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        },
        {
          data: [120, 232, 301, 434, 590, 1030, 1320],
          type: 'line',
          smooth: true
        },
        {
          data: [20, 1332, 300, 400, 500, 900, 500],
          type: 'line',
          smooth: true
        }
      ]
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
    this.option4 = {
      title: {
          text: '堆叠区域图'
      },
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
          data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : false,
              data : ['周一','周二','周三','周四','周五','周六','周日']
          }
      ],
      yAxis : [
          {
              type : 'value'
          }
      ],
      series : [
          {
              name:'邮件营销',
              type:'line',
              stack: '总量',
              areaStyle: {},
              data:[120, 132, 101, 134, 90, 230, 210]
          },
          {
              name:'联盟广告',
              type:'line',
              stack: '总量',
              areaStyle: {},
              data:[220, 182, 191, 234, 290, 330, 310]
          },
          {
              name:'视频广告',
              type:'line',
              stack: '总量',
              areaStyle: {},
              data:[150, 232, 201, 154, 190, 330, 410]
          },
          {
              name:'直接访问',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data:[320, 332, 301, 334, 390, 330, 320]
          },
          {
              name:'搜索引擎',
              type:'line',
              stack: '总量',
              label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
              },
              areaStyle: {normal: {}},
              data:[820, 932, 901, 934, 1290, 1330, 1320]
          }
      ]
    };
  }

  onChartInit4(ec) {
    this.echartsInstance4 = ec;
  }

  setTotalQueries() {
    this.option5 = {
          title : {
              text: '南丁格尔玫瑰图',
              subtext: '纯属虚构',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              x : 'center',
              y : 'bottom',
              data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
          },
          toolbox: {
              show : true,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel']
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          series : [
              {
                  name:'半径模式',
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
                  data:[
                      {value:10, name:'rose1'},
                      {value:5, name:'rose2'},
                      {value:15, name:'rose3'},
                      {value:25, name:'rose4'},
                      {value:20, name:'rose5'},
                      {value:35, name:'rose6'},
                      {value:30, name:'rose7'},
                      {value:40, name:'rose8'}
                  ]
              },
              {
                  name:'面积模式',
                  type:'pie',
                  radius : [30, 110],
                  center : ['75%', '50%'],
                  roseType : 'area',
                  data:[
                      {value:10, name:'rose1'},
                      {value:5, name:'rose2'},
                      {value:15, name:'rose3'},
                      {value:25, name:'rose4'},
                      {value:20, name:'rose5'},
                      {value:35, name:'rose6'},
                      {value:30, name:'rose7'},
                      {value:40, name:'rose8'}
                  ]
              }
          ]
      };
  }

  onChartInit5(ec) {
    this.echartsInstance5 = ec;
  }

  setTotalMinutes() {
    var keyValue = 60;
    var name = "中";
    if (keyValue < 50) {
        name = "低";
    } else if (keyValue > 80) {
        name = "高";
    }
    var serie = [600, -200, 300, 500];
    var tital = '贡献度指数: ' + serie[0];
    var serie1 = [6, 2, 8];
    var serie2 = [0.3, 0.5, 0.2];
    var colors = ['#5793f3', '#d48265', '#91c7ae'];
    //var colors = ['orange', '#d14a61', '#1E90FF'];
    var legend = ['分值', '权重'];
    // 基于准备好的dom，初始化echarts实例
    this.option6 = null;
    this.option6 = {
        backgroundColor: '#ffffff',
        title: [{
            text: tital,
            left: '50%',
            top: '5%',
            textAlign: 'center'
        }, {
            left: '28%',
            top: '51%',
            textAlign: 'center'
        }, {
            text: '',
            left: '78%',
            top: '51%',
            textAlign: 'center'
        }],
        toolbox: {
            feature: {
                dataView: {
                    show: true,
                    optionToContent: (opt) => {
                        var table = '';
                        table += '<table style="width:100%;text-align:center"><tbody>';
                        table += '<tr><td>贡献度指数</td><td>存款效益</td><td>贷款效益</td><td>贷款效益</td></tr>';
                        table += '<tr>' + '<td>' + serie[0] + '</td>' + '<td>' + serie[1] + '</td>' + '<td>' + serie[2] + '</td>' + '<td>' + serie[3] + '</td>' + '</tr>';
                        table += '</tbody></table>';
                        table += '<hr/>';
                        table += '<table style="width:100%;text-align:center"><tbody>';
                        table += '<tr><td style="text-align:left;">忠诚度指数:' + keyValue + '</td></tr>';
                        table += '</tbody></table>';
                        table += '<hr/>';
                        table += '<table style="width:100%;text-align:center"><tbody>';
                        table += '<tr><td>忠诚度指数明细</td><td>存款</td><td>理财</td><td>基金</td></tr>';
                        table += '<tr>' + '<td>分值</td>' + '<td>' + serie1[0] + '</td>' + '<td>' + serie1[1] + '</td>' + '<td>' + serie1[2] + '</td>' + '</tr>';
                        table += '<tr>' + '<td>权重</td>' + '<td>' + serie2[1] + '</td>' + '<td>' + serie2[1] + '</td>' + '<td>' + serie2[2] + '</td>' + '</tr>';
                        table += '</tbody></table>';
                        return table;
                    },
                    readOnly: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        /* tooltip: {
        trigger: 'axis'
        } ,*/
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            fomatter: (obj) => {
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' + tital + '</div>' +
                    '<span>' + '存款效益' + '</span>' +
                    ' : ' + serie[1] + '<br/>' +
                    '<span>' + '中间业务效益' + '</span>' + ' : ' + serie[2] + '<span>' +
                    '贷款效益' + '</span>' + ' : ' + serie[3]
            }
        },
        legend: {
            type: 'plain',
            top: '35%',
            pageButtonGap: 10,
            pageButtonPosition: 'end',
            data: ['存款效益', '中间业务效益', '贷款效益']
        },
        grid: [{
            show: false,
            left: '0%',
            top: '5%',
            containLabel: true,
            width: '95%',
            height: '30%'
        }, {
            show: false,
            left: '3%',
            top: '48%',
            containLabel: true,
            width: '45%',
            height: '50%'
        }, {
            show: false,
            left: '53%',
            top: '48%',
            containLabel: true,
            width: '42%',
            height: '45%'
        }],
        /* legend : [ {
        type : 'plain',
        top : '35%',
        data : [ '存款效益', '中间业务效益', '贷款效益' ]
        }, {
        }, {
        type : 'scroll',
        top : '5%',
        pageButtonGap : 10,
        pageButtonPosition : 'end',
        data : [ '暂降频次3', '暂降频次4' ],
        x : 'right',
        } ], */
        xAxis: [{
            gridIndex: 0,
            type: 'value',
            offset: -85,
            splitLine: {
                show: false, //让X轴数据不显示
            }
        }, {
            gridIndex: 1,
            show: false
        }, {
            gridIndex: 2,
            type: 'category',
            axisLabel: {
                // interval:0,//横轴信息全部显示
                rotate: -30 //-30度角倾斜显示
            },
            name: '忠诚度指数明细',
            nameLocation: 'center',
            nameGap: '30',
            nameTextStyle: {
                fontSize: 12
            },
            axisTick: {
                // alignWithLabel: true
            },
            // boundaryGap: false,
            data: ['存款', '理财', '基金']
        }],
        yAxis: [{
            gridIndex: 0,
            type: 'category',
            splitNumber: 0,
            boundaryGap: [0, 0],
            axisLabel: {
                show: false, //让Y轴数据不显示
            },
            itemStyle: {},
            axisTick: {
                show: false, //隐藏Y轴刻度
            },
            axisLine: {
                show: false, //隐藏Y轴线段
            },
            data: [tital]
        }, {
            gridIndex: 1,
            position: 'left',
            show: false
        }, {
            gridIndex: 2,
            type: 'value',
            name: '分值',
            position: 'left',
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} '
            },
            axisTick: {
                alignWithLabel: true
            }
        }, {
            gridIndex: 2,
            type: 'value',
            name: '权重',
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[2]
                }
            },
            axisLabel: {
                formatter: '{value} '
            },
            axisTick: {
                alignWithLabel: true
            }
        }],
        series: [{
            name: '存款效益',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            stack: '效益',
            barCategoryGap: 0,
            barGap: 0,
            barWidth: 50,
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [serie[1]]
        }, {
            name: '中间业务效益',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            stack: '效益',
            barCategoryGap: 0,
            barGap: 0,
            barWidth: 50,
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [serie[2]]
        }, {
            name: '贷款效益',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            stack: '效益',
            barCategoryGap: 0,
            barGap: 0,
            barWidth: 50,
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [serie[3]]
        }, {
            name: '忠诚度指数',
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'gauge',
            radius: '50%',
            center: ['27%', '73%'],
            min: 0,
            max: 100,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 30,
                    shadowBlur: 0,
                    color: [
                        [0.3, '#C23531'],
                        [0.6, '#63869e'],
                        [0.8, '#bda29a'],
                        [0.9, '#d48265'],
                        [1, '#91c7ae']
                    ]
                }
            },
            axisLabel: {
                formatter: (e) => {
                    switch (e + "") {
                        case "10":
                            return "低";
                        case "50":
                            return "一般";
                        case "70":
                            return "良好";
                        case "90":
                            return "高";
                        case "100":
                            return "极好";
                        default:
                            return e;
                    }
                },
                textStyle: {
                    fontSize: 12,
                    fontWeight: ""
                }
            },
            detail: {
                formatter: '{value}'
            },
            title: {
                fontSize: 12
            },
            data: [{
                value: keyValue,
                name: '忠诚度指数'
            }]
        }, {
            name: '分值',
            type: 'bar',
            smooth: true,
            barWidth: 25,
            xAxisIndex: 2,
            yAxisIndex: 2,
            symbolSize: 8, //拐点大小
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: colors[1],
                }
            },
            lineStyle: {
                normal: {
                    width: 4,
                    color: colors[1]
                }
            },
            data: serie1
        }, {
            name: '权重',
            type: 'bar',
            smooth: true,
            barWidth: 25,
            xAxisIndex: 2,
            yAxisIndex: 3,
            symbolSize: 8, //拐点大小
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: colors[2],
                }
            },
            lineStyle: {
                normal: {
                    width: 4,
                    color: colors[2]
                }
            },
            data: serie2
        }]
    };
  }

  onChartInit6(ec) {
    this.echartsInstance6 = ec;
  }

  setMinutesCalm() {
    const spNum = 5;
    const _max=100;
    const legendData = ['常住人口', '户籍人口', '农村人口','城镇居民'];
    const y_data = ['成都市', '绵阳市', '自贡市', '攀枝花市', '泸州市', '德阳市'];
    const _datamax = [100,100,100,100,100,100];
    const _data1 = [10,15,10,13,15,11];
    const _data2 = [19,5,40,33,15,51];
    const _data3 = [21,55,10,13,35,11];
    const _data4 = [21,55,10,13,35,11];
    const fomatter_fn = (v) => {
        return (v.value / _max * 100).toFixed(0)
    }
    const _label = {
        normal: {
            show: true,
            position: 'inside',
            formatter: fomatter_fn,
            textStyle: {
                color: '#fff',
                fontSize: 16
            }
        }
    };
    this.option7 = {
        backgroundColor: '#091034',
        legend: {
            data: legendData,
            textStyle: {
                color: '#ccc'
            }
        },
        grid: {
            containLabel: true,
            left: 0,
            right: 15,
            bottom: 30
        },
        tooltip: {
            show: true,
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: {
                color: '#3c3c3c',
                fontSize: 16
            },
            formatter: (p) => {
                console.log(p);
                var _arr = p.seriesName.split('/'),
                idx = p.seriesIndex;//1，2，3
                return '名称：' + p.seriesName + '<br>' + '完成：' + p.value + '<br>' + '占比：' + (p.value / _max * 100).toFixed(0) + '%';
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
        },
        xAxis: {
            splitNumber: spNum,
            interval: _max / spNum,
            max: _max,
            axisLabel: {
                show: false,
                formatter: (v) => {
                    var _v = (v / _max * 100).toFixed(0);
                    return +_v === 0 ? _v : _v + '%';
                }
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
                fontSize: 16,
                color: '#fff'

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
        }, {
            show: false,
            data: y_data,
            axisLine: {
                show: false
            }
        }],
        series: [{
            type: 'bar',
            name: '常住人口',
            stack: '2',
            label: _label,
            legendHoverLink: false,
            barWidth: 40,
            itemStyle: {
                normal: {
                    color: '#7E47FF'
                },
                emphasis: {
                    color: '#7E47FF'
                }
            },
            data: _data1
        }, {
            type: 'bar',
            name: '户籍人口',
            stack: '2',
            legendHoverLink: false,
            barWidth: 40,
            label: _label,
            itemStyle: {
                normal: {
                    color: '#FD5916'
                },
                emphasis: {
                    color: '#FD5916'
                }
            },
            data: _data2
        }, {
            type: 'bar',
            stack: '2',
            name: '农村人口',
            legendHoverLink: false,
            barWidth: 40,
            label: _label,
            itemStyle: {
                normal: {
                    color: '#01A4F7'
                },
                emphasis: {
                    color: '#01A4F7'
                }
            },
            data: _data3
        }, {
            type: 'bar',
            stack: '2',
            name: '城镇居民',
            legendHoverLink: false,
            barWidth: 40,
            label: _label,
            itemStyle: {
                normal: {
                    color: '#2EDDCD'
                },
                emphasis: {
                    color: '#2EDDCD'
                }
            },
            data: _data4
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
