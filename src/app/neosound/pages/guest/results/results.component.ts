import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { Router } from '@angular/router';

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
  @Output() refresh = new EventEmitter<boolean>();

  constructor(private filesService: FilesService, private router: Router) {
    this.fileParams = this.filesService.getQuickFileParams();
    if (!this.fileParams) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
    this.getInfo();
    this.intervalRef = setInterval(() => {
      // this.count--;
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
        if (this.results.results.length || this.count < 0) {
          clearInterval(this.intervalRef);
        }
        console.log(this.results);
        if (this.results.results && this.results.results[0]) {
          this.analysisResult = this.results.results;
          this.setChartData();
          this.filesService.getFileResultJson({
            uri: this.results.results[0].identity.uri,
          }).subscribe(jsonData => {
            this.emotions = jsonData.json.emosp;
          },
          (e) => this.errorMessage = e.error.message,
          );
        }
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  setChartData() {
    this.chartData = [
      {
        name: Math.round(this.analysisResult[0].data.spangervol) + '% Anger', //.toFixed(2),
        value: this.analysisResult[0].data.spangervol, //.toFixed(2),
      },
      {
        name: Math.round((100 - this.analysisResult[0].data.spangervol)) + '% Calm', //.toFixed(2),
        value: (100 - this.analysisResult[0].data.spangervol), //.toFixed(2),
      },
    ];
  }

  getEmotionImg() {
    return (this.analysisResult[0].data.spangervol > 50) ? 'angry' : 'neutral';
  }

  getHappiness(val) {
    return 100 - val;
  }

  discard() {
    this.refresh.emit(true);
    return false;
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
  }

}
