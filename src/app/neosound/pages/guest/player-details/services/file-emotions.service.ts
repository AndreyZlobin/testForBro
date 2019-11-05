import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileEmotionsService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileEmotionsStore: {
    emotions: any[];
    music: any[];
  } = {
    emotions: [],
    music: [],
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
            if (data.result.anger) {
              if (data.result.anger.ints) {
                this.fileEmotionsStore.emotions =
                  data.result.anger.ints;
              }
              if (data.result.anger.music) {
                this.fileEmotionsStore.music = data.result.anger.music;
              }
            }
            if (data.result.merged) {
              if (data.result.merged.intprobs) {
                this.fileEmotionsStore.emotions =
                  data.result.merged.intprobs;
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
