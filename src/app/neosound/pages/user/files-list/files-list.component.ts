import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { frLocale } from 'ngx-bootstrap';
import { LanguageService } from '../../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../../shared';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit, OnDestroy {
  sub: Subscription;
  files;
  errorMessage = '';
  filesResult = [];
  isLoading = true;
  proccessing = {};
  pagesArr = [1];
  totalCount = 0;
  sortBy = 'uploaded';
  sort = 'up';
  filter;
  datefrom; // = new Date();
  dateto; //  = new Date();
  angerfrom ; // = 0;
  angerto; //  = 100;
  pausefrom; //  = 0;
  pauseto; //  = 10000;
  page; //  = 0;
  batchid; // = 1;
  batchidAll = true;
  datefromAll = true;
  datetoAll = true;
  angerfromAll = true;
  angertoAll = true;
  pausefromAll = true;
  pausetoAll = true;
  keywordsOnly = false;
  filename = '';
  paginationNum = 100;
  dateVisible = true;

  datePickerFromOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    // minDate: new Date(Date.now()), // Minimal selectable date
    // maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'from', // HTML input placeholder attribute (default: '')
    addClass: 'form-control form-control-lg form-gr-first', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {'width': '100%'}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };

  datePickerToOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    // minDate: new Date(Date.now()), // Minimal selectable date
    // maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'to', // HTML input placeholder attribute (default: '')
    addClass: 'form-control form-control-lg form-gr-last', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {'width': '100%'}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };
  private sideFilterHasClass = false;

  constructor(
    private filesService: FilesService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    ) { }

  ngOnInit() {
    this.sub = this.route.data
      .subscribe(v => {
        this.router.navigateByUrl('/user/files');
      });
    // this.resetFilter();
    this.filter = this.filesService.getFilter();
    this.sortBy = this.filter.sortby;
    this.sort = this.filter.sortorder;
    this.getPage(0, this.filter);

    // const els = document.getElementsByClassName('scrollable-container');
    // const el = els[0];
    // el && el.addEventListener('scroll', (e) => {
    //   if (el.scrollTop > 75 && !this.sideFilterHasClass) {
    //     document.getElementById('side-filter').classList.add('scrolled');
    //     this.sideFilterHasClass = true;
    //   } else if (el.scrollTop < 75 && this.sideFilterHasClass) {
    //     document.getElementById('side-filter').classList.remove('scrolled');
    //     this.sideFilterHasClass = false;
    //   }
    // });
  }

  getPage(page = 0, parameters = this.filter) {
    // this.isLoading = true;
    const params = this.filter = {
      ...parameters,
      'itemsn': `${this.paginationNum}`,
      'pagen': '' + (page + 1),
    };
    this.page = page;
    this.filesService.listFilesPage(params).subscribe(res => {
      if (res && res.files) this.isLoading = false;
      if (!res || res.totalcount === 0) {
        this.isLoading = false;
        this.files = [];
        return;
      }
      // const a = new Array(Math.round(res.count / 50));
      this.totalCount = res.totalcount;
      this.pagesArr = Array.from({length: Math.ceil(res.totalcount / 100) }, (v, k) => k + 1);
      this.files = res.files;
      // this.isLoading = false;
      // .sort((a, b) => {
      //   const x = +new Date(a.uploaddate);
      //   const y = +new Date(b.uploaddate);
      //   return y - x;
      // });
    });
  }

  getPages() {
    if (this.files && (Math.ceil(this.files.length / this.paginationNum) > 1)) {
      return Array.from({length: Math.ceil(this.files.length / this.paginationNum) }, (v, k) => k+1);
    }
    return [];
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
    this.getPage(this.page);
    // this.filesService.listFiles({}).subscribe(res => {
    //   if (!res) {
    //     this.files = [];
    //     this.totalCount = 0;
    //     this.pagesArr = [1];
    //     return;
    //   }
    //   this.totalCount = res.count;
    //   this.pagesArr = Array.from({length: Math.ceil(res.count / 50) }, (v, k) => k+1);
    //   this.files = res.files.sort((a, b) => {
    //     const x = +new Date(a.uploaddate);
    //     const y = +new Date(b.uploaddate);
    //     return y - x;
    //   });
    // },
    // (e) => this.errorMessage = e.error.message,
    // );
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
    return `/file/${encodeURIComponent(item.batchid)}/${encodeURIComponent(item.fileid)}`;
  }

  proccessFile(item, i) {
    // const params = item;
    const params = {
      'batchid': item.batchid,
      'filename': item.filename,
    };
    this.proccessing[i] = true;
    this.filesService.processFile(params).subscribe(v => {

      // this.filesService.processFile(params, 3).subscribe(v => {
      //   this.filesService.processFile(params, 5).subscribe(v => {
      //     this.filesService.processFile(params, 7).subscribe(v => {
            this.proccessing[i] = false;
            this.refresh();
      //     });
      //   });
      // });

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

  getOpacityLevelPause(val) {
    if (!val) {
      return '';
    }
    let result;
    if (val < 1) {
      result = 0;
    }
    result = val / 20;
    return 'rgba(5, 5, 255, ' + result + ')';
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
        sortName = 'Uploaded';
        break;
      case 'duration':
        sortName = 'Duration';
        break;
      case 'emotion':
        sortName = 'Emotion';
        break;
      case 'avgpause':
        sortName = 'AvgPause';
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

    this.filesService.setFilter(this.filter);

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
    this.dateVisible = false;
    this.datefrom = undefined;
    this.dateto = undefined;
    setTimeout(() => this.dateVisible = true, 0);
    this.angerfrom = null;
    this.angerto = null;
    this.pausefrom = null;
    this.pauseto = null;
    this.page = null;
    this.batchid = null;
    this.batchidAll = true;
    this.datefromAll = true;
    this.datetoAll = true;
    this.angerfromAll = true;
    this.angertoAll = true;
    this.pausefromAll = true;
    this.pausetoAll = true;
    this.keywordsOnly = false;
    this.filename = '';
    this.filter = {
      'itemsn': '100',
      'pagen': '1',
      // 'batchid': '1',
      // 'datetimefrom': '',
      // 'datetimeto': '',
      // 'angervolfrom': '',
      // 'angervolto': '',
      // 'sortby': '',
      // 'sortorder': 'asc',
      // 'export': '',
    };
    this.getPage(0, this.filter);
    this.filesService.setFilter(this.filter);
    this.cd.detectChanges();
  }

  exportCSV() {
    const params = {
      ...this.filter,
      export: 'csv',
    };
    this.filesService.listFilesPage(params).subscribe(data =>
      // this.downloadFile(data)
      (window.location.href = data.url)
      ),
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
      'datetimefrom': this.datefrom || '',
      'datetimeto': this.dateto || '',
      'angervolfrom': this.angerfrom && '' + this.angerfrom || '',
      'angervolto': (this.angerfrom || this.angerto) ? '' + (this.angerfrom > this.angerto ? 100 : this.angerto) : '',
      'pausefrom': this.pausefrom && '' + this.pausefrom || '',
      'pauseto': (this.pausefrom || this.pauseto) ? '' + (this.pausefrom > this.pauseto ? 10000 : this.pauseto) : '',
      'batchid': this.batchid && '' + this.batchid || '',
      'filename': this.filename,
      'keywordsOnly': this.keywordsOnly,
    };
    Object.keys(this.filter).forEach((key) => (this.filter[key] === '' || this.filter[key] === undefined || this.filter[key] === null) && delete this.filter[key]);
    this.getPage(0, this.filter);
  }

  t(v) {
    return LanguageService.t(v);
  }

  getFilesOnPageLabel() {
    return ((this.page + 1) * 100 < this.files.length) ? (this.page + 1) * 100 : this.files.length;
  }

  getKeywords(item) {
    return item.keywords && item.keywords.length
      ? item.keywords.join(', ')
      : '';
  }

  get primaryColor() {
    return this.dataService.config && (this.dataService.config as any).colors && (this.dataService.config as any).colors.primary || 'rgb(0, 154, 210)';
  }

  get secondaryColor() {
    return this.dataService.config && (this.dataService.config as any).colors && (this.dataService.config as any).colors.secondary || 'rgb(0, 154, 210)';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
