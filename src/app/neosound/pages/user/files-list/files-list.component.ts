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

  constructor(private filesService: FilesService) { }

  ngOnInit() {
    this.filesService.listFiles({}).subscribe(res => {
      this.files = res.files;
    });
  }

  refresh() {
    this.filesService.listFiles({}).subscribe(res => {
      this.files = res.files;
    },
    (e) => this.errorMessage = e.error.message,
    );
  }

  getLink(item) {
    return `/file/${encodeURIComponent(item.batchid)}/${encodeURIComponent(item.filename)}`;
  }

}
