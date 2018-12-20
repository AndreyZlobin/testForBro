import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { frLocale } from 'ngx-bootstrap';

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
  filter;
  datefrom = new Date();
  dateto = new Date();
  angerfrom = 0;
  angerto = 0;

  datePickerOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    minDate: new Date(Date.now()), // Minimal selectable date
    maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };

  constructor(private filesService: FilesService) { }

  ngOnInit() {
    this.resetFilter();
  }

  getPage(page = 0, parameters = this.filter) {
    const params = this.filter = {
      'itemsn': '100',
      'pagen': '' + (page + 1),
      ...parameters,
    };
    this.filesService.listFilesPage(params).subscribe(res => {
      if (res && res.files) this.isLoading = false;
      if (!res || res.totalcount == 0) {
        this.isLoading = false;
        this.files = [];
        return;
      }
      // const a = new Array(Math.round(res.count / 50));
      this.totalCount = res.count;
      this.pagesArr = Array.from({length: Math.ceil(res.totalcount / 100) }, (v, k) => k+1);
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
    if (!val) {
      return '';
    }
    let result;
    if (val.anger < 1) {
      result = 0;
    }
    result = val.anger / 2 / 100;
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

    let sortName = '';
    switch (sortBy) {
      case 'name':
        sortName = 'Name';
        break;
      case 'uploaded':
        sortName = 'Datefrom';
        break;
      case 'duration':
        sortName = 'Duration';
        break;
      case 'emotion':
        sortName = 'Emotion';
        break;

      default:
        break;
    }
    this.filter = {
      ...this.filter,
      'sortby': sortName,
      'sortorder': this.sort === 'up' ? 'desc' : 'asc',
    };
    this.getPage(0, this.filter);
    return;
    // if (sortBy !== this.sortBy) {
    //   this.sort = 'up';
    // } else {
    //   this.sort = this.sort === 'up' ? 'down' : 'up';
    // }
    // this.sortBy = sortBy;
    // switch (sortBy) {
    //   case 'name':
    //     this.files = this.files.sort((a, b) => {
    //       return this.sort === 'up' ? a.filename.localeCompare(b.filename) : b.filename.localeCompare(a.filename);
    //     });
    //     break;
    //   case 'uploaded':
    //     this.files = this.files.sort((a, b) => {
    //       const x = +new Date(a.uploaddate);
    //       const y = +new Date(b.uploaddate);
    //       return this.sort === 'up' ? y - x : x - y;
    //     });
    //     break;
    //   case 'duration':
    //     this.files = this.files.sort((a, b) => {
    //       return this.sort === 'up' ? a.duration - b.duration : b.duration - a.duration;
    //     });
    //     break;
    //   case 'emotion':
    //     this.files = this.files.sort((a, b) => {
    //       let x;
    //       let y;
    //       if (!a.angertop || !a.angertop.anger) {
    //         x = 0;
    //       } else {
    //         x = a.angertop.anger;
    //       }
    //       if (!b.angertop || !b.angertop.anger) {
    //         y = 0;
    //       } else {
    //         y = b.angertop.anger;
    //       }
    //       return this.sort === 'up' ? y - x : x - y;
    //     });
    //     break;

    //   default:
    //     break;
    // }


  }

  resetFilter() {
    this.filter = {
      'itemsn': '100',
      'pagen': '1',
      'batchid': '1',
      // 'datetimefrom': '',
      // 'datetimeto': '',
      // 'angervolfrom': '',
      // 'angervolto': '',
      // 'sortby': '',
      // 'sortorder': 'asc',
      // 'export': '',
    };
    this.getPage(0, this.filter);
  }

  exportCSV() {
    const params = {
      ...this.filter,
      export: 'csv',
    };
    this.filesService.listFilesPage(params).subscribe(data => this.downloadFile(data)),
      error => console.log('Error downloading the file.'),
      () => console.info('OK');
  }
  downloadFile(data: Response) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  filterIt() {
    this.filter = {
      ...this.filter,
      'datetimefrom': this.datefrom,
      'datetimeto': this.dateto,
      'angervolfrom': this.angerfrom,
      'angervolto': this.angerto,
    };
    this.getPage(0, this.filter);
  }

}
