import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private filesService: FilesService, private router: Router) {
    this.fileParams = this.filesService.getQuickFileParams();
    if (!this.fileParams) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
    let count = 20;
    this.intervalRef = setInterval(() => {
      count--;
      this.filesService.listFileResults(this.fileParams).subscribe(res => {
        this.results = res;
        if (this.results.results.length || count < 0) {
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
          });
        }
    });
    }, 20000);

  }

  setChartData() {
    this.chartData = [
      {
        name: this.analysisResult[0].data.angervol, //.toFixed(2),
        value: this.analysisResult[0].data.angervol, //.toFixed(2),
      },
      {
        name: (100 - this.analysisResult[0].data.angervol), //.toFixed(2),
        value: (100 - this.analysisResult[0].data.angervol), //.toFixed(2),
      },
    ];
  }

  getHappiness(val) {
    return 100 - val;
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
  }

}
