import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilesService {
  private currentFileParams;

  constructor(
    private http: HttpClient
  ) { }

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

  listFiles(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listFiles`,
      params
    );
  }

  processFile(params): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3'
    };
    return this.http.post(`${environment.api}/processFile`,
      params
    );
  }

  uploadFile(params): Observable<any> {
    return this.http.post('https://neosound.eu/server/api/uploadFileMP.php', params);
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

}
