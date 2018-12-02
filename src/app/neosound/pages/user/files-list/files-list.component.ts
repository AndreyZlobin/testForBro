import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../../services/files.service';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  files;
  errorMessage = '';
  filesResult = [];
  isLoading = true;
  proccessing = false;
  pagesArr = [1];
  totalCount = 0;
  sortBy = 'uploaded';
  sort = 'up';

  constructor(private filesService: FilesService) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(page = 0) {
    const params = {
      itemsn: 50,
      pagen: page,
    };
    this.filesService.listFiles({}).subscribe(res => {
      if (res && res.files) this.isLoading = false;
      if (!res || res.count == 0) {
        this.isLoading = false;
        this.files = [];
        return;
      }
      // const a = new Array(Math.round(res.count / 50));
      this.totalCount = res.count;
      this.pagesArr = Array.from({length: Math.ceil(res.count / 50) }, (v, k) => k+1);
      this.files = res.files.sort((a, b) => {
        const x = +new Date(a.uploaddate);
        const y = +new Date(b.uploaddate);
        return y - x;
      });
    });
  }

  getEmotionName(val) {
    return val && Object.keys(val)[0];
  }

  getEmotionValue(val) {
    return val && val[Object.keys(val)[0]] && val[Object.keys(val)[0]] + '%';
  }

  // getFileResult(file) {
  //   this.filesService.listFileResults({
  //     'batchid': file.batchid,
  //     'filename': file.fileid,
  //     'date': file.uploaddate,
  //   }).subscribe(res => {
  //     if (res.result) {
  //       this.filesResult.p
  //     }
  //   },
  //   (e) => this.errorMessage = e.error.message,
  //   );
  // }

  // getEmotionValue() {
  //   let max = 0;
  //   let name = '';
  //   if (this.analysisResult.Anger > max) {
  //     max = this.analysisResult.Anger;
  //     name = 'Anger';
  //   }
  //   if (this.analysisResult.Happy > max) {
  //     max = this.analysisResult.Happy;
  //     name = 'Happy';
  //   }
  //   if (this.analysisResult.Neutral > max) {
  //     max = this.analysisResult.Neutral;
  //     name = 'Neutral';
  //   }
  //   if (this.analysisResult.Sadness > max) {
  //     max = this.analysisResult.Sadness;
  //     name = 'Sadness';
  //   }
  //   // const name = '' + Object.keys(this.analysisResult.fourclass.latest.data.top)[0];
  //   return max;
  // }

  // getEmotionName() {
  //   let max = 0;
  //   let name = '';
  //   if (this.analysisResult.Anger > max) {
  //     max = this.analysisResult.Anger;
  //     name = 'Anger';
  //   }
  //   if (this.analysisResult.Happy > max) {
  //     max = this.analysisResult.Happy;
  //     name = 'Happy';
  //   }
  //   if (this.analysisResult.Neutral > max) {
  //     max = this.analysisResult.Neutral;
  //     name = 'Neutral';
  //   }
  //   if (this.analysisResult.Sadness > max) {
  //     max = this.analysisResult.Sadness;
  //     name = 'Sadness';
  //   }
  //   // const name = '' + Object.keys(this.analysisResult.fourclass.latest.data.top)[0];
  //   return name ? name : 'Neutral';
  // }

  refresh() {
    this.filesService.listFiles({}).subscribe(res => {
      if (!res) {
        this.files = [];
        this.totalCount = 0;
        this.pagesArr = [1];
        return;
      }
      this.totalCount = res.count;
      this.pagesArr = Array.from({length: Math.ceil(res.count / 50) }, (v, k) => k+1);
      this.files = res.files.sort((a, b) => {
        const x = +new Date(a.uploaddate);
        const y = +new Date(b.uploaddate);
        return y - x;
      });
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  delete(batchid, filename) {
    this.filesService.deleteFile({
      batchid,
      filename,
    }).subscribe(res => {
      this.refresh();
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  getLink(item) {
    return `/file/${encodeURIComponent(item.batchid)}/${encodeURIComponent(item.filename)}`;
  }

  proccessFile(item) {
    const params = item;
    this.proccessing = true;
    this.filesService.processFile(params).subscribe(v => {

      this.filesService.processFile(params, 3).subscribe(v => {
        this.filesService.processFile(params, 5).subscribe(v => {
          this.filesService.processFile(params, 7).subscribe(v => {
            this.proccessing = false;
            this.refresh();
          });
        });
      });

    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  getEmotionImg(item) {
    if (!item || !item.fourclasstop) return '';
    const emK = Object.keys(item.fourclasstop);
    const img = emK && emK[0];
    return img ? img.toLowerCase() : 'neutral';
  }

  getOpacityLevelAnger(val) {
    let result;
    if (val < 1) {
      result = 0;
    }
    result = val / 2 / 100;
    return 'rgba(255, 5, 5, ' + result + ')';
  }

  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }

  sortTable(sortBy) {
    if (sortBy !== this.sortBy) {
      this.sort = 'up';
    } else {
      this.sort = this.sort === 'up' ? 'down' : 'up';
    }
    this.sortBy = sortBy;

    switch (sortBy) {
      case 'name':
        this.files = this.files.sort((a, b) => {
          return this.sort === 'up' ? a.filename.localeCompare(b.filename) : b.filename.localeCompare(a.filename);
        });
        break;
      case 'uploaded':
        this.files = this.files.sort((a, b) => {
          const x = +new Date(a.uploaddate);
          const y = +new Date(b.uploaddate);
          return this.sort === 'up' ? y - x : x - y;
        });
        break;
      case 'duration':
        this.files = this.files.sort((a, b) => {
          return this.sort === 'up' ? a.duration - b.duration : b.duration - a.duration;
        });
        break;
      case 'emotion':
        this.files = this.files.sort((a, b) => {
          let x;
          let y;
          if (!a.angertop || !a.angertop.anger) {
            x = 0;
          } else {
            x = a.angertop.anger;
          }
          if (!b.angertop || !b.angertop.anger) {
            y = 0;
          } else {
            y = b.angertop.anger;
          }
          return this.sort === 'up' ? y - x : x - y;
        });
        break;

      default:
        break;
    }


  }

}
