import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FilesService {
  private filesSubject = new BehaviorSubject<any>({});
  public files = this.filesSubject.asObservable();
  private store: any = {};
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
    debugger;
    params = params || {
      batchid: "1234",
      filename: "1.mp3"
    };
    return this.http.post(`${environment.api}/getFile`, params);
  }
  getAudioWaveForm(params): Observable<any> {
    params = params;
    return this.http.post(`${environment.api}/getAudioWaveForm`, params);
  }
  getFileStats(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/fileStats`, params);
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
    return this.http.post(`${environment.api}/tagCloud `, params);
  }

  deleteFile(params): Observable<any> {
    params = params || {
      batchid: "1234",
      filename: "1.mp3"
    };
    return this.http.post(`${environment.api}/deleteFile`, params);
  }

  listFiles(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFiles`, params);
  }

  listFilesPage(params): void {
    params = params || {};
    this.http
      .post(`${environment.api}/listFilesPage`, params)
      .subscribe(res => {
        this.store = res;
        this.filesSubject.next(this.store);
      });
  }
  postListFilesPage(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFilesPage`, params);
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

  getNextLink(fileName: string, batchId: string): string {
    if (this.store && this.store.files && this.store.files.length) {
      const index = this.store.files.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );

      if (index !== -1 && this.store.files[index + 1]) {
        return `/file/${this.store.files[index + 1].batchid}/${this.store.files[index + 1].filename}`;
      }
      return "";
    } else {
      return "";
    }
  }
  getPrevLink(fileName: string, batchId: string): string {
    if (this.store && this.store.files && this.store.files.length) {
      const index = this.store.files.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );
      if (index !== -1 && this.store.files[index - 1]) {
        return `/file/${this.store.files[index - 1].batchid}/${this.store.files[index - 1].filename}`;
      }
      return "";
    } else {
      return "";
    }
  }

  hasNextLink(fileName: string, batchId: string): boolean {
    let res = true;
    if (this.store && this.store.files && this.store.files.length) {
      const index = this.store.files.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );
      if (index !== -1 && this.store.files[index + 1]) {
        res = false;
      }
    }
    return res;
  }
  hasPrevLink(fileName: string, batchId: string): boolean {
    let res = true;
    if (this.store && this.store.files && this.store.files.length) {
      const index = this.store.files.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );
      if (index !== -1 && this.store.files[index - 1]) {
        res = false;
      }
    }
    return res;
  }
}
