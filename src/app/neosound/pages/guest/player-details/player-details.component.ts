import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as WaveSurfer from 'wavesurfer.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  fileParams;
  results;
  emotions: any[];
  intervalRef;
  analysisResult;
  chartData;
  fileUrl;
  wavesurfer;
  attempsCount = 20;
  subRoute: Subscription;

  constructor(private filesService: FilesService, private router: Router, private route: ActivatedRoute) {
    this.fileParams = this.filesService.getQuickFileParams();
    // test file
    this.fileParams = {batchid: 1, filename: '2018-9-18_0:1:11.wav'};

    this.subRoute = this.route.params.subscribe(params => {
      this.fileParams = {
        filename: decodeURIComponent(params.filename),
        batchid: decodeURIComponent(params.batchid),
      };
      this.filesService.getFile(this.fileParams).subscribe(res => {
        this.fileUrl = res.url;
        this.loadAudio();
      });
    });

    if (!this.fileParams) {
      // this.router.navigateByUrl('/');
    }
    if (this.fileParams) {
      this.filesService.getFile(this.fileParams).subscribe(res => {
        this.fileUrl = res.url;
        this.loadAudio();
      });
    }
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.wavesurfer = WaveSurfer.create({
        container: '#myWavesurferContainer',
        waveColor: 'violet',
        progressColor: 'purple'
      });
      this.loadAudio();
      this.wavesurfer.on('ready', function () {
        // http://wavesurfer-js.org/plugins/regions.html
        // const timeline = Object.create(WaveSurfer.Timeline);

        // timeline.init({
        //     wavesurfer: wavesurfer,
        //     container: "#wave-timeline"
        // });
    });
    });
  }

  loadAudio() {
    if (this.wavesurfer && this.fileUrl) {
      this.wavesurfer.load(this.fileUrl);
    }
  }

  play() {
    this.wavesurfer.playPause();
  }

  ngOnInit() {
    this.getInfo();
    this.attempsCount = 20;
    this.intervalRef = setInterval(() => {
      this.attempsCount--;
      this.getInfo();
    }, 20000);
  }

  getInfo() {
    this.filesService.listFileResults(this.fileParams).subscribe(res => {
      this.results = res;
      if (this.results.results.length || this.attempsCount < 0) {
        clearInterval(this.intervalRef);
      }
      console.log(this.results);
      if (this.results.results && this.results.results[0]) {
        this.analysisResult = this.results.results;

        this.filesService.getFileResultJson({
          uri: this.results.results[0].identity.uri,
        }).subscribe(jsonData => {
          this.emotions = jsonData.json.emosp;
        });
      }
  });
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setSeconds(parseInt(val, 10));
    return d;
  }

  ngOnDestroy() {
    this.subRoute.unsubscribe();
  }

}
