import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";
import { TransitiveCompileNgModuleMetadata } from "@angular/compiler";

@Injectable()
export class FileResultService {
  private batchId: string;
  private fileName: string;
  private fileResultStore: {
    isLoading: boolean;
    emotionsAnger: any[];
    regions: any;
    emotions: any[];
    emotionsSounds: any[];
    sttfulltext: any;
    keywords: any[];
    misswords: any[];
    misswordsNotFound: any[];
    greySpeaker: any;
    emotionsSttAnger: any[];
    compliance: string;
  } = {
    isLoading: true,
    emotionsAnger: [],
    regions: [],
    emotions: [],
    emotionsSounds: [],
    sttfulltext: null,
    keywords: [],
    misswords: [],
    misswordsNotFound: [],
    greySpeaker: "",
    emotionsSttAnger: [],
    compliance: ""
  };
  private fileResultSubject = new BehaviorSubject<any>({});
  public fileResult = this.fileResultSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getResult(batchId: string, fileName: string) {
    this.fileResultStore.isLoading = true;
    this.fileResultStore.emotions = [];
    this.fileResultStore.keywords = [];
    this.fileResultStore.misswords = [];
    this.fileResultStore.misswordsNotFound = [];
    this.fileResultStore.emotionsSttAnger = [];
    this.fileResultStore.sttfulltext = null;
    this.fileResultStore.emotionsAnger = [];
    this.fileResultStore.compliance = "";
    this.fileName = fileName;
    this.batchId = batchId;
    this.fileResultSubject.next(this.fileResultStore);
    this.filesService
      .getFileResultDetails({
        batchid: batchId,
        filename: fileName
      })
      .subscribe(data => {
        if (data) {
          if (data.result) {
            if (data.result.anger) {
              if (data.result.anger.ints) {
                this.fileResultStore.emotionsAnger = data.result.anger.ints;
                this.fileResultStore.emotions = this.fileResultStore.emotionsAnger;
              }
              if (data.result.anger.music) {
                this.fileResultStore.emotionsSounds = data.result.anger.music;
              }
            }
            if (data.result.stt) {
              if (data.result.stt.fulltext) {
                this.fileResultStore.sttfulltext = data.result.stt.fulltext;
              }
              if (
                data.result.stt.keywords &&
                Array.isArray(data.result.stt.keywords)
              ) {
                this.fileResultStore.keywords = data.result.stt.keywords;
                this.fileResultStore.misswords = [];
              } else {
                this.fileResultStore.keywords = data.result.stt.keywords.stop;
                this.fileResultStore.misswords = data.result.stt.keywords.miss;
                this.fileResultStore.misswordsNotFound =
                  data.result.stt.keywords.missmiss;
              }
              this.fileResultStore.compliance = this.getCompliancePercents(
                data.result.stt.keywords.miss,
                data.result.stt.keywords.missmiss
              );
              if (data.result.stt.speakers) {
                if (Array.isArray(data.result.stt.speakers)) {
                  if (data.result.stt.speakers.length > 1) {
                    this.fileResultStore.greySpeaker =
                      data.result.stt.speakers[1];
                  }
                } else {
                  if (Object.keys(data.result.stt.speakers).length > 1) {
                    this.fileResultStore.greySpeaker = Object.keys(
                      data.result.stt.speakers
                    )[1];
                  }
                }
              }
            }

            if (data.result.merged) {
              if (data.result.merged.intervalprobs) {
                this.fileResultStore.emotionsSttAnger = data.result.merged.intprobs;
                this.fileResultStore.emotions = this.fileResultStore.emotionsSttAnger;
              }
            }
          }
          this.setRegions();
        }
        this.fileResultStore.isLoading = false;
        this.fileResultSubject.next(this.fileResultStore);
      });
  }
  getCompliancePercents(misswords: any[], misswordsNotFound: any[]): string {
    if (misswords.length || misswordsNotFound.length) {
      const perc =
        misswords.length / (misswords.length + misswordsNotFound.length);
      return Math.round(perc * 100) + "%";
    }
    return "N/A";
  }
  setRegions(): void {
    const inputData = this.fileResultStore.emotionsSounds
      ? this.fileResultStore.emotions.concat(
          this.fileResultStore.emotionsSounds
        )
      : this.fileResultStore.emotions;
    if (!this.fileResultStore.emotions) return;
    const data = inputData || this.fileResultStore.emotions;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      this.fileResultStore.regions.push({
        start: element[0],
        end: element[1],
        color: this.getColor(element[3], element[2], !element[2])
      });
    }

    if (this.fileResultStore.emotionsAnger) {
      for (
        let index = 0;
        index < this.fileResultStore.emotionsAnger.length;
        index++
      ) {
        const element = this.fileResultStore.emotionsAnger[index];
        this.fileResultStore.regions.push({
          start: element[0],
          end: element[1],
          color: this.getColor(element[3], element[2], !element[2])
        });
      }
    }
    this.fileResultSubject.next(this.fileResultStore);
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
