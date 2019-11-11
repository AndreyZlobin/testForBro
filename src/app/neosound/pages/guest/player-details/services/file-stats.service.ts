import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileStatsService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileStatsStore: {
    popularWords: any[];
    sankeyData: any;
    treeRadialData: any;
  };
  private fileInfoSubject = new BehaviorSubject<any>({});
  public fileInfo = this.fileInfoSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getInfo(batchId: string, fileName: string) {
    if (batchId !== this.batchId && fileName !== this.fileName) {
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
            this.fileStatsStore.popularWords = data.popularWords;
            this.fileStatsStore.sankeyData = data.sankeyData;
            this.fileStatsStore.treeRadialData = data.treeRadialData;
          } else {
            this.fileStatsStore.popularWords = null;
            this.fileStatsStore.sankeyData = null;
            this.fileStatsStore.treeRadialData = null;
          }
        });
      this.fileInfoSubject.next(this.fileStatsStore);
      this.isLoading = false;
    } else {
      this.fileInfoSubject.next(this.fileStatsStore);
      this.isLoading = false;
    }
  }
}
