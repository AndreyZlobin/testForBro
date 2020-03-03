import { Component, OnInit } from '@angular/core';
import { energy } from './mocks';
import { FilesService } from '../../../services/files.service';
import { LanguageService } from '../../../services/language.service';
import ColorScheme from "color-scheme";
import {HttpClient} from "@angular/common/http";


const rgbToHex = rgb => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const fullColorHex = (r, g, b) => {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red + green + blue;
};


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
  option8: any = {};
  echartsInstance8;

  isLoading = true;
  fileStatLoaded = false;
  minutesStatLoaded = false;
  apiStatLoaded = false;

  fileStat: any = {};
  minutesStat: any = {};
  apiStat: any = {};

  config = {};
  colors = [];
  primarycolor;
  radialTreeData = {data: '', level: 1};

  constructor(
    private filesService: FilesService,
    private http: HttpClient
  ) {  }

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

    this.http.get("assets/config/config.json").subscribe((data: any) => {
      this.config = data;
      const scheme = new ColorScheme();
      const rgb = data.colors.secondary
        .substring(4, data.colors.secondary.length - 1)
        .replace(/ /g, "")
        .split(",");
      const hex = fullColorHex(rgb[0], rgb[1], rgb[2]);

      const s = 'tetrade', d = 0.5, v = 'pastel';
      scheme
        .from_hex(hex)
        .scheme(s)
        .distance(d)
        .variation(v);
      // this.colors = [`#${hex}`, ...scheme.colors().map(c => `#${c}`)];
      this.primarycolor = `#${hex}`;
      this.colors = scheme.colors().map(c => `#${c}`);
      this.colors = [
        this.colors[0], this.colors[4], this.colors[8],
        this.colors[1], this.colors[5], this.colors[9],
        this.colors[2], this.colors[6], this.colors[10],
        this.colors[3], this.colors[7], this.colors[11]
      ];

      this.setColors('default');
    });

    this.setKeywordsRadialTreeData('default');
    this.setLevelRadialTreeData(1);
    // this.initCharts();
  }

  setColors(theme) {
    const themeColors = {
      'default': ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a", "#6e7074", "#546570", "#c4ccd3"],
      'macarons': ['#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80', '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050', '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'],
      'dark': ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'],
      'shine': ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487'],
      'infografic': ['#C1232B','#27727B','#FCCE10','#E87C25','#B5C334', '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'],
      'roma': ['#E01F54','#001852','#f5e8c8','#b8d2c7','#c6b38e', '#a4d8c2','#f3d999','#d3758f','#dcc392','#2e4783',
        '#82b6e9','#ff6347','#a092f1','#0a915d','#eaf889','#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6'],
      'vintage': ['#d87c7c','#919e8b', '#d7ab82',  '#6e7074','#61a0a8','#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'],
      'walden': ["#3fb1e3", "#6be6c1", "#626c91", "#a0a7e6", "#c4ebad", "#96dee8"],
      'westeros': ["#516b91", "#59c4e6","#edafda","#93b7e3","#a5e7f0","#cbb0e3"],
      'wonderland': ["#4ea397","#22c3aa","#7bd9a5",'#d0648a',"#f58db2","#f2b3c9"]
    };

    this.colors = themeColors[theme] || themeColors['default'];
    this.initCharts();
  }

  setKeywordsRadialTreeData(key) {
    const keys = {
      'default': 'data7',
      'data4': 'data4',
      'data5': 'data5',
      'data6': 'data6',
      'data7': 'data7',
      'data8': 'data8',
    };

    this.radialTreeData.data = keys[key] || keys['default'];
    this.initCharts();
  }

  setLevelRadialTreeData(key) {
    this.radialTreeData.level = key || 1;
    this.initCharts();
  }

  // getColors(s, d, v) {
  //     const scheme = new ColorScheme();
  //     const rgb = this.config.colors.secondary
  //       .substring(4, this.config.colors.secondary.length - 1)
  //       .replace(/ /g, "")
  //       .split(",");
  //     const hex = fullColorHex(rgb[0], rgb[1], rgb[2]);
  //
  //     scheme
  //       .from_hex(hex)
  //       .scheme(s)
  //       .distance(d)
  //       .variation(v);
  //
  //     return [`#${hex}`, ...scheme.colors().map(c => `#${c}`)];
  // }

  initCharts() {
    if (!this.fileStatLoaded || !this.minutesStatLoaded || !this.apiStatLoaded) {
        return;
    }
    this.isLoading = false;
    this.setSankey();
    this.setWeekChart();
    this.setTotalMinutes();
  }

  t(v) {
    return LanguageService.t(v);
  }

  setSankey() {
    // console.log(this.colors.length + ': ' + this.colors);
    this.option1 = {
        color: this.colors,
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

  setWeekChart() {
    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a','10a','11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'];
    var days = ['Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

    var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];

    this.option3 = {
      color: this.colors,
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
        color: this.colors,
      // color: [this.colors[0], this.colors[6], this.colors[1]],
      //   backgroundColor: '#ffffff',
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


  // resizeChart() {
  //   if (this.echartsInstance) {
  //     this.echartsInstance.resize();
  //   }
  // }

}
