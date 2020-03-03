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
    isLoading: boolean;
  } = {
    bytes: 0,
    url: null,
    isLoading: false
  };
  private fileInfoSubject = new BehaviorSubject<any>({});
  public fileInfo = this.fileInfoSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getInfo(batchId: string, fileName: string) {
    if (fileName && batchId) {
      this.fileName = fileName;
      this.batchId = batchId;
      this.fileInfoSubject.next({url: null});
      this.filesService
        .getFile({
          batchid: batchId,
          filename: fileName
        })
        .subscribe(data => {
          if (data) {
            this.fileInfoSubject.next({url: data.url});
          }
        });
    }
  }
}
