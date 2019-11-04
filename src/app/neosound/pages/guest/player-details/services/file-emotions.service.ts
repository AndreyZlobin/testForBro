import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileEmotionsService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileEmotionsStore: {
    emotions: [];
    music: [];
  } = {
    emotions: null,
    music: null
  };
  private fileInfoSubject = new BehaviorSubject<any>({});
  public fileInfo = this.fileInfoSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getFileEmotions(batchId: string, fileName: string) {
    if (batchId !== this.batchId && fileName !== this.fileName) {
      this.isLoading = true;
      this.fileName = fileName;
      this.batchId = batchId;
      this.filesService
        .getFileResultDetails({
          batchid: batchId,
          filename: fileName
        })
        .subscribe(data => {
          if (data) {
            if (data.results.result.anger) {
              if (data.results.result.anger.ints) {
                this.fileEmotionsStore.emotions =
                  data.results.result.anger.ints;
              }
              if (data.results.result.anger.music) {
                this.fileEmotionsStore.music = data.results.result.anger.music;
              }
            }
            if (data.results.result.merged) {
              if (data.results.result.merged.intprobs) {
                data.fileEmotionsStore.emotions =
                  data.results.result.merged.intprobs;
              }
            }
          } else {
            this.fileEmotionsStore.emotions = [];
            this.fileEmotionsStore.music = [];
          }
          this.fileInfoSubject.next(this.fileEmotionsStore);
          this.isLoading = false;
        });
    } else {
      this.fileInfoSubject.next(this.fileEmotionsStore);
    }
  }
}
