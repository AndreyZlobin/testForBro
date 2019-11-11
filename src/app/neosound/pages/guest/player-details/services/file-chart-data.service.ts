import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileChartDataService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileDataStore: {
    popularWords: any[];
    sankeyData: any;
    treeRadialData: any;
  } = {
    popularWords: [],
    sankeyData: {},
    treeRadialData: {}
  };
  private dataSubject = new BehaviorSubject<any>({});
  public chartData = this.dataSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getFileChartData(batchId: string, fileName: string) {
    if (batchId !== this.batchId && fileName !== this.fileName) {
      this.isLoading = true;
      this.fileName = fileName;
      this.batchId = batchId;
      this.filesService
        .getEchartData({
          batchid: batchId,
          filename: fileName
        })
        .subscribe(data => {
          this.fileDataStore.popularWords = [];
          this.fileDataStore.sankeyData = null;
          this.fileDataStore.treeRadialData = null;
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
          this.dataSubject.next(this.fileDataStore);
          this.isLoading = false;
        });
    } else {
      this.dataSubject.next(this.fileDataStore);
    }
  }
}
