import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileChartDataService {
  private batchId: string;
  private fileName: string;
  private fileDataStore: {
    isLoading: boolean;
    popularWords: any[];
    sankeyData: any;
    treeRadialData: any;
  } = {
    isLoading: true,
    popularWords: [],
    sankeyData: {},
    treeRadialData: {}
  };
  private dataSubject = new BehaviorSubject<any>({});
  public chartData = this.dataSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getFileChartData(batchId: string, fileName: string) {
    if (fileName !== this.fileName) {
      this.fileDataStore.popularWords = [];
      this.fileDataStore.sankeyData = null;
      this.fileDataStore.treeRadialData = null;
      this.fileDataStore.isLoading = true;
      this.dataSubject.next(this.fileDataStore);
      this.fileName = fileName;
      this.batchId = batchId;
      this.filesService
        .getDetailsEchartData({
          batchid: batchId,
          filename: fileName
        })
        .subscribe(data => {
          if (data) {
            if (data.popularWords) {
              this.fileDataStore.popularWords = data.popularWords;
            }
            if (data && data.sentiment) {
              if (data.sentiment.sankeyData) {
                this.fileDataStore.sankeyData = data.sentiment.sankeyData;
              }
              if (data.sentiment.treeRadialData) {
                this.fileDataStore.treeRadialData =
                  data.sentiment.treeRadialData;
              }
            }
          }
          this.fileDataStore.isLoading = false;
          this.dataSubject.next(this.fileDataStore);
        });
    } else {
      this.dataSubject.next(this.fileDataStore);
    }
  }
}
