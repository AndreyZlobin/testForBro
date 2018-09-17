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
        if (this.results.results && this.results.results[0]) {
          this.filesService.getFileResultJson({
            uri: this.results.results[0].identity.uri,
          }).subscribe(jsonData => {
            this.emotions = jsonData.emosp;
          });
        }
    });
    }, 20000);

  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
  }

}
