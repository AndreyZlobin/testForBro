import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileTextStatsService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileEmotionsStore: {
    text: string;
    missWord: any;
    missWordNotFound: any;
    stopWords: any;
    missPhrases: any;
    stopPhrases: any;
    sentiment: string;
    speakers: any;
    compliance: string;
  } = {
    text: "",
    missWord: [],
    missWordNotFound: [],
    stopWords: [],
    missPhrases: [],
    stopPhrases: [],
    sentiment: "",
    speakers: [],
    compliance: ""
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
          if (data && data.result && data.result.stt) {
            const stt = data.result.stt;
            this.fileEmotionsStore.text = stt.fulltext;
            this.fileEmotionsStore.missWord = stt.keywords.miss;
            this.fileEmotionsStore.missWordNotFound = stt.keywords.missmiss;
            this.fileEmotionsStore.stopWords = stt.keywords.stop;
            this.fileEmotionsStore.missPhrases = stt.phrases.miss;
            this.fileEmotionsStore.stopPhrases = stt.phrases.stop;
            this.fileEmotionsStore.sentiment = stt.sentiment;
            this.fileEmotionsStore.speakers = stt.speakers;
            this.fileEmotionsStore.compliance = this.getCompliancePercents(
              stt.keywords.miss,
              stt.keywords.missmiss
            );
          } else {
            this.fileEmotionsStore.text = "";
            this.fileEmotionsStore.missWord = [];
            this.fileEmotionsStore.missWordNotFound = [];
            this.fileEmotionsStore.stopWords = [];
            this.fileEmotionsStore.missPhrases = [];
            this.fileEmotionsStore.stopPhrases = [];
            this.fileEmotionsStore.sentiment = "";
            this.fileEmotionsStore.speakers = [];
            this.fileEmotionsStore.compliance = "";
          }
          this.fileInfoSubject.next(this.fileEmotionsStore);
          this.isLoading = false;
        });
    } else {
      this.fileInfoSubject.next(this.fileEmotionsStore);
    }
  }
  getCompliancePercents(misswords: any[], misswordsNotFound: any[]): string {
    if (misswords.length || misswordsNotFound.length) {
      const perc =
        misswords.length / (misswords.length + misswordsNotFound.length);
      return Math.round(perc * 100) + "%";
    }
    return "N/A";
  }
}
