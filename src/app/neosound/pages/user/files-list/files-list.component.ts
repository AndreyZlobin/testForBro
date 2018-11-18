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

  constructor(private filesService: FilesService) { }

  ngOnInit() {
    this.filesService.listFiles({}).subscribe(res => {
      if (res.files) this.isLoading = false;
      if (res.count == 0) {
        this.isLoading = false;
        this.files = [];
        return;
      }
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
    return val && val[Object.keys(val)[0]];
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

      this.filesService.processFile(params, 3).subscribe(v => {});
      this.filesService.processFile(params, 5).subscribe(v => {});
      this.filesService.processFile(params, 7).subscribe(v => {});
      this.proccessing = false;
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  getEmotionImg(item) {
    if (!item || !item.fourclasstop) return 'neutral';
    const emK = Object.keys(item.fourclasstop);
    const img = emK && emK[0];
    return img ? img.toLowerCase() : 'neutral';
  }

}
