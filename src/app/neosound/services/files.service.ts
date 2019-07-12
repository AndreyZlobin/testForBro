import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilesService {
  private currentFileParams;
  private savedFilter = {};
  private keyWord = ''
  private batchId = '';

  constructor(
    private http: HttpClient
  ) { }

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

  getFile(params): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3'
    };
    return this.http.post(`${environment.api}/getFile`,
      params
    );
  }
  getFileStats(params): Observable<any> {
    params = params || {
    };
    return this.http.post(`${environment.api}/fileStats`,
      params
    );
  }
  getEchartData(params): Observable<any> {
    params = params || {
    };
    return this.http.post(`${environment.api}/getEchartData`,
      params
    );
  }
  getApiCallsStats (params): Observable<any> {
    params = params || {
    };
    return this.http.post(`${environment.api}/apiCallsStats`,
      params
    );
  }
  getMinutesStats (params): Observable<any> {
    params = params || {
    };
    return this.http.post(`${environment.api}/minutesStats`,
      params
    );
  }
  getTagClowd(params): Observable<any> {
    params = params || {
    };
    return this.http.post(`${environment.api}/tagCloud `,
      params
    );
  }

  deleteFile(params): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3'
    };
    return this.http.post(`${environment.api}/deleteFile`,
      params
    );
  }

  listFiles(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFiles`,
      params
    );
  }

  listFilesPage(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFilesPage`,
      params
    );
  }

  processFile(params/*, mlid = 9*/): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3',
    };
    params = {
      ...params,
      // mlid: '' + mlid,
    };
    return this.http.post(`${environment.api}/processFile`,
      params
    );
  }

  uploadFile(params): Observable<any> {
    return this.http.post(`${environment.api}/uploadFile`, params);
  }

  listFileResults(params): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3',
    };
    return this.http.post(`${environment.api}/listFileResults`, params);
  }

  getFileResultJson(params): Observable<any> {
    params = params || {
      'uri': '1234',
    };
    return this.http.post(`${environment.api}/getFileResultJson`,
      params
    );
  }

  getFileResultDetails(params): Observable<any> {
    params = params || {
      'batchid': '1',
      'filename': '1.mp3',
    };
    return this.http.post(`${environment.api}/getFileResultDetails`,
      params
    );
  }

  updateFileInfo(params): Observable<any> {
    return this.http.post(`${environment.api}/updateFileInfo`,
      params,
    );
  }
}
