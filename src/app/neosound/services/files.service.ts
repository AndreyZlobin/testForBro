import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FilesService {
  private filesSubject = new BehaviorSubject<any>({});
  public files = this.filesSubject.asObservable();
  public store: any = {};
  private currentFileParams;
  private savedFilter = {
    itemsn: 100,
    pagen: 1
  };
  private keyWord = "";
  private batchId = "";

  constructor(private http: HttpClient) {}

  setFilter(params) {
    this.savedFilter = params;
  }
  setKeyWord(keyWord) {
    this.keyWord = keyWord;
  }
  getKeyWord() {
    return this.keyWord;
  }
  setBatchId(batchId) {
    this.batchId = batchId;
  }
  getBatchId() {
    return this.batchId;
  }

  getFilter() {
    return this.savedFilter;
  }

  setQuickFileParams(params) {
    this.currentFileParams = params;
  }

  getQuickFileParams() {
    return this.currentFileParams;
  }
  resetFiles() {
    this.store = null;
    this.filesSubject.next([]);
  }
  getFile(params): Observable<any> {
    return this.http.post(`${environment.api}/getFile`, params);
  }
  getRegions(params): Observable<any> {
    return this.http.post(`${environment.api}/getFileResultDetails`, params);
  }
  getAudioWaveForm(params): Observable<any> {
    params = params;
    return this.http.post(`${environment.api}/getAudioWaveForm`, params);
  }
  getFileStats(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/fileStats`, params);
  }
  getTextStats(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/textStats`, params);
  }
  getEchartData(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/getEchartData`, params);
  }


  getApiCallsStats(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/apiCallsStats`, params);
  }
  getMinutesStats(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/minutesStats`, params);
  }
  getTagClowd(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/tagCloud`, params);
  }
  getTopicCloud(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/topicCloud`, params);
  }
  getTextStopwords(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/textStopwords`, params);
  }



  deleteFile(params): Observable<any> {
    params = params || {
      batchid: "1234",
      filename: "1.mp3"
    };
    return this.http.post(`${environment.api}/deleteFile`, params);
  }
  listBatches(): Observable<any> {
    return this.http.post(`${environment.api}/listBatches`, {});
  }
  listTextBatches() : Observable<any> {
    return this.http.post(`${environment.api}/listTextBatches`, {});
  }
  deleteTextFile(id): Observable<any> {
    return this.http.post(`${environment.api}/deleteTextFile`, { id: id });
  }

  listFiles(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFiles`, params);
  }

  listFilesPage(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFilesPage`, params);
  }
  listTextFilesPage(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listTextFiles`, params);
  }
  postListFilesPage(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFilesPage`, params);
  }
  postListTextFiles(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listTextFiles`, params);
  }

  processFile(params /*, mlid = 9*/): Observable<any> {
    params = params || {
      batchid: "1234",
      filename: "1.mp3"
    };
    params = {
      ...params
    };
    return this.http.post(`${environment.api}/processFile`, params);
  }

  uploadFile(params): Observable<any> {
    return this.http.post(`${environment.api}/uploadFile`, params);
  }

  listFileResults(params): Observable<any> {
    return this.http.post(`${environment.api}/listFileResults`, params);
  }

  markFavorite(item, index) {
    if (this.store.files[index]) {
      this.store.files[index].pin = `${!(item.pin === "true")}`;
      this.filesSubject.next(this.store);
    }
  }

  getFileResultJson(params): Observable<any> {
    params = params || {
      uri: "1234"
    };
    return this.http.post(`${environment.api}/getFileResultJson`, params);
  }

  getFileResultDetails(params): Observable<any> {
    params = params || {
      batchid: "1",
      filename: "1.mp3"
    };
    return this.http.post(`${environment.api}/getFileResultDetails`, params);
  }

  updateFileInfo(params): Observable<any> {
    return this.http.post(`${environment.api}/updateFileInfo`, params);
  }
  updateTextFileInfo(params): Observable<any> {
    return this.http.post(`${environment.api}/updateTextFileInfo`, params);
  }
  getTextFileResultDetails(fileId: string): Observable<any> {
    return this.http.post(`${environment.api}/getTextFileResultDetails`, {
      id: fileId
    });
  }


  getDetailsEchartData(params): Observable<any> {
    return this.http.post(`${environment.api}/getDetailsEchartData`, params);
  }

  listTopics(): Observable<any> {
    return this.http.post(`${environment.api}/listTopics`, {});
  }

  getFileChecklist(params): Observable<any> {
    return this.http.post(`${environment.api}/getFileChecklist`, params);
  }
  updateFileChecklist(params): Observable<any> {
    return this.http.post(`${environment.api}/updateFileChecklist`, params);
  }
  updateFileComment(params): Observable<any> {
    return this.http.post(`${environment.api}/updateFileInfo`, params);
  }


}
