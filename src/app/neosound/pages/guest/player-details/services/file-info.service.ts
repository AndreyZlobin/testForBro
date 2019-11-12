import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileInfoService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileInfoStore: {
    bytes: number;
    url: string;
  };
  private fileInfoSubject = new BehaviorSubject<any>({});
  public fileInfo = this.fileInfoSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getInfo(batchId: string, fileName: string) {
    if (fileName !== this.fileName) {
      this.isLoading = true;
      this.fileName = fileName;
      this.batchId = batchId;
      this.filesService
        .getFile({
          batchid: batchId,
          filename: fileName
        })
        .subscribe(data => {
          if (data) {
            this.fileInfoStore.bytes = data.bytes;
            this.fileInfoStore.url = data.url;
          } else {
            this.fileInfoStore.bytes = null;
            this.fileInfoStore.url = null;
          }
        });
      this.fileInfoSubject.next(this.fileInfoStore);
      this.isLoading = false;
    } else {
      this.fileInfoSubject.next(this.fileInfoStore);
      this.isLoading = false;
    }
  }
}
