import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FileTextStatsService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileEmotionsStore: {
    text: [];
    missWord: [];
    missWordNotFound: [];
    stopWords: [];
    missPhrases: [];
    stopPhrases: [];
    sentiment: string;
    speakers: [];
    compliance: string;
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
            this.fileEmotionsStore.text = stt;
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
            this.fileEmotionsStore.text = null;
            this.fileEmotionsStore.missWord = null;
            this.fileEmotionsStore.missWordNotFound = null;
            this.fileEmotionsStore.stopWords = null;
            this.fileEmotionsStore.missPhrases = null;
            this.fileEmotionsStore.stopPhrases = null;
            this.fileEmotionsStore.sentiment = null;
            this.fileEmotionsStore.speakers = null;
            this.fileEmotionsStore.compliance = null;
          }
          this.fileInfoSubject.next(this.fileEmotionsStore);
          this.isLoading = false;
        });
    } else {
      this.fileInfoSubject.next(this.fileEmotionsStore);
    }
  }
  getCompliancePercents(misswords: [], misswordsNotFound: []): string {
    if (misswords.length || misswordsNotFound.length) {
      const perc =
        misswords.length / (misswords.length + misswordsNotFound.length);
      return Math.round(perc * 100) + "%";
    }
    return "N/A";
  }
}
