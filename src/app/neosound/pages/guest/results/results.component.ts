import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  gender = 'male';
  fileParams;
  results;
  emotions: any[];
  intervalRef;
  analysisResult;
  chartData;
  count = 20;
  showThanks = false;
  errorMessage = '';
  tooltipDisabled = true;
  view = [undefined, undefined];
  @Output() refresh = new EventEmitter<boolean>();
  @Input() hideAdditionalInfo = false;
  chartScheme = {
    domain: [
      '#4abce2', '#ffa823', '#e54128', '#b2d11e', '#7e0d81',
    ],
  };
  customColors: any[] = [
    {
      name: 'Anger',
      value: '#e54128',
    },
    {
      name: 'Neutral',
      value: '#4abce2',
    },
  ];
  routerFileName = '';

  constructor(private filesService: FilesService, private router: Router) {
    this.fileParams = this.filesService.getQuickFileParams();
    if (!this.fileParams) {
      this.router.navigateByUrl('/');
    }
    this.routerFileName = `/file/${this.fileParams.batchid}/${this.fileParams.filename}`;
  }

  ngOnInit() {
    this.getInfo();
    this.intervalRef = setInterval(() => {
      this.count--;
      // this.filesService.listFileResults(this.fileParams).subscribe(res => {
      //   this.results = res;
      //   if (this.results.results.length || this.count < 0) {
      //     clearInterval(this.intervalRef);
      //   }
      //   console.log(this.results);
      //   if (this.results.results && this.results.results[0]) {
      //     this.analysisResult = this.results.results;
      //     this.setChartData();
      //     this.filesService.getFileResultJson({
      //       uri: this.results.results[0].identity.uri,
      //     }).subscribe(jsonData => {
      //       this.emotions = jsonData.json.emosp;
      //     });
      //   }
    // });
      this.getInfo();
    }, 20000);
  }

  getInfo() {
    // this.emotions = [['0','0','a','60']];
    // this.analysisResult = [];
    // this.analysisResult.push({data: {spangervol: 60}});
    this.filesService.listFileResults(this.fileParams).subscribe(res => {
      this.results = res;
      if (
        // res.result
        // && (
        //   res.result.Anger
        //   || res.result.Happy
        //   || res.result.Neutral
        //   || res.result.Sadness
        //   || res.result.emotional
        //   || res.result.female
        //   || res.result.male
        //   || res.result.mid
        //   || res.result.old
        //   || res.result.young)
        this.count <= 0
       ) {
          clearInterval(this.intervalRef);
        }
        if (res.result
          && (
            res.result.Anger !== ''
            || res.result.Happy !== ''
            || res.result.Neutral !== ''
            || res.result.Sadness !== ''
            || res.result.emotional !== ''
            || res.result.female !== ''
            || res.result.male !== ''
            || res.result.mid !== ''
            || res.result.old !== ''
            || res.result.young !== '')
         ) {
          this.analysisResult = this.results.result;
          this.setChartData();
          this.gender = res.result.male > res.result.female ? 'male' : 'female';

          if (res.result
            && (
              res.result.Anger !== ''
              && res.result.Happy !== ''
              && res.result.Neutral !== ''
              && res.result.Sadness !== ''
              && res.result.emotional !== ''
              && res.result.female !== ''
              && res.result.male !== ''
              && res.result.mid !== ''
              && res.result.old !== ''
              && res.result.young !== '')
           ) {
            clearInterval(this.intervalRef);
           }
          // this.filesService.getFileResultJson({
          //   uri: this.results.fourclass.latest.identity.uri,
          // }).subscribe(jsonData => {
          //   this.emotions = jsonData.json.emosp;
          // },
          // (e) => this.errorMessage = e.error.message,
          // );
        }
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  setChartData() {
    this.customColors[0].name = Math.round(this.analysisResult.Anger) + '% Anger';
    this.customColors[1].name = Math.round(this.analysisResult.Neutral) + '% Neutral';
    this.chartData = [
      {
        name: Math.round(this.analysisResult.Anger) + '% ' + this.t('Anger'), //.toFixed(2),
        value: this.analysisResult.Anger, //.toFixed(2),
      },
      {
        name: Math.round(this.analysisResult.Sadness) + '% ' + this.t('Sad'), //.toFixed(2),
        value: this.analysisResult.Sadness, //.toFixed(2),
      },
      {
        name: Math.round(this.analysisResult.Neutral) + '% ' + this.t('Neutral'), //.toFixed(2),
        value: this.analysisResult.Neutral, //.toFixed(2),
      },
      {
        name: Math.round(this.analysisResult.Happy) + '% ' + this.t('Happy'), //.toFixed(2),
        value: this.analysisResult.Happy, //.toFixed(2),
      },
    ];
  }
  labelFormatting(data) {
    return data;
  }

  getEmotionImg() {
    if (!this.analysisResult) return;
    let max = 0;
    let img = '';
    let name = this.analysisResult.top.fourclass
      && Object.keys(this.analysisResult.top.fourclass)
      && Object.keys(this.analysisResult.top.fourclass)[0];
    // if (this.analysisResult.Anger > max) {
    //   max = this.analysisResult.Anger;
    //   img = 'angry';
    // }
    // if (this.analysisResult.Happy > max) {
    //   max = this.analysisResult.Happy;
    //   img = 'happy';
    // }
    // if (this.analysisResult.Neutral > max) {
    //   max = this.analysisResult.Neutral;
    //   img = 'neutral';
    // }
    // if (this.analysisResult.Sadness > max) {
    //   max = this.analysisResult.Sadness;
    //   img = 'sad';
    // }
    // const img = (('' + Object.keys(this.analysisResult.fourclass.latest.data.top)[0]).toLowerCase());
    switch (name) {
      case 'Anger':
        img = 'angry';
        break;
      case 'Happy':
        img = 'happy';
        break;
      case 'Sadness':
        img = 'sad';
        break;
      case 'Neutral':
        img = 'neutral';
        break;

      default:
        img = 'neutral';
        break;
    }
    return img ? img : 'neutral';
  }

  getEmotionName() {
    let max = 0;
    let name = this.analysisResult.top.fourclass
      && Object.keys(this.analysisResult.top.fourclass)
      && Object.keys(this.analysisResult.top.fourclass)[0];
    // if (this.analysisResult.Anger > max) {
    //   max = this.analysisResult.Anger;
    //   name = 'Anger';
    // }
    // if (this.analysisResult.Happy > max) {
    //   max = this.analysisResult.Happy;
    //   name = 'Happy';
    // }
    // if (this.analysisResult.Neutral > max) {
    //   max = this.analysisResult.Neutral;
    //   name = 'Neutral';
    // }
    // if (this.analysisResult.Sadness > max) {
    //   max = this.analysisResult.Sadness;
    //   name = 'Sadness';
    // }
    // const name = '' + Object.keys(this.analysisResult.fourclass.latest.data.top)[0];
    return name ? name : 'Neutral';
  }

  getEmotionValue() {
    const name = this.analysisResult.top.fourclass
      && Object.keys(this.analysisResult.top.fourclass)
      && Object.keys(this.analysisResult.top.fourclass)[0];
    const max = name ? this.analysisResult.top.fourclass[name] : 0;
    // let name = '';
    // if (this.analysisResult.Anger > max) {
    //   max = this.analysisResult.Anger;
    //   name = 'Anger';
    // }
    // if (this.analysisResult.Happy > max) {
    //   max = this.analysisResult.Happy;
    //   name = 'Happy';
    // }
    // if (this.analysisResult.Neutral > max) {
    //   max = this.analysisResult.Neutral;
    //   name = 'Neutral';
    // }
    // if (this.analysisResult.Sadness > max) {
    //   max = this.analysisResult.Sadness;
    //   name = 'Sadness';
    // }
    // const name = '' + Object.keys(this.analysisResult.fourclass.latest.data.top)[0];
    return max;
  }

  getAge(val) {
    let max = 0;
    let name = '';
    if (this.analysisResult.mid > max) {
      max = this.analysisResult.mid;
      name = 'mid';
    }
    if (this.analysisResult.old > max) {
      max = this.analysisResult.old;
      name = 'old';
    }
    if (this.analysisResult.young > max) {
      max = this.analysisResult.young;
      name = 'young';
    }
    // const name = '' + Object.keys(this.analysisResult.fourclass.latest.data.top)[0];
    return val === name;
  }

  getHappiness(val) {
    return 100 - val;
  }

  discard() {
    this.refresh.emit(true);
    return false;
  }

  t(v) {
    return LanguageService.t(v);
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
  }

}
