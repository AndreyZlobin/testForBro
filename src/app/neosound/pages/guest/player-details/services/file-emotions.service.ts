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
    sentiments: any[];
    music: any[];
    regions: any;
  } = {
    emotions: [],
    sentiments: [],
    music: [],
    regions: []
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
                this.fileEmotionsStore.emotions = [...data.result.anger.ints];
              }
              if (data.result.anger.music) {
                this.fileEmotionsStore.music = [...data.result.anger.music];
              }
              this.fileInfoSubject.next(this.fileEmotionsStore);
            }
            if (data.result.merged) {
              if (data.result.merged.intprobs) {
                this.fileEmotionsStore.sentiments = [...data.result.merged.intprobs];
              }
              this.fileInfoSubject.next(this.fileEmotionsStore);
            }
          }
          console.log(this.fileEmotionsStore.emotions);
          this.fileInfoSubject.next(this.fileEmotionsStore);
          this.isLoading = false;
        });
    } else {
      this.fileInfoSubject.next(this.fileEmotionsStore);
    }
  }
  getRegions(): void {
    const inputData = this.fileEmotionsStore.music
      ? this.fileEmotionsStore.emotions.concat(this.fileEmotionsStore.music)
      : this.fileEmotionsStore.emotions;
    if (!this.fileEmotionsStore.emotions) return;
    const data = inputData || this.fileEmotionsStore.emotions;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      this.fileEmotionsStore.regions.push({
        start: element[0],
        end: element[1],
        color: this.getColor(element[3], element[2], !element[2])
      });
    }


    this.fileInfoSubject.next(this.fileEmotionsStore);
  }

  getColor(val: any, type?: string, isMusic = false) {
    if (isMusic) {
      return "rgba(0,255,0, 1)";
    }
    const x = val / 2 + 50;
    return (
      "rgba(255, " + (255 - (x - 50) * 5) + ", " + (255 - (x - 50) * 5) + ", 1)"
    );
  }
}
