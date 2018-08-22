import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilesService {

  constructor(
    private http: HttpClient
  ) { }

  getFile(params): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3'
    };
    return this.http.post(`${environment.api}/getFile`,
      params
    );
  }

  listUserFiles(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/listUserFiles`,
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
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3',
      'base64string': ''
    };
    return this.http.post(`${environment.api}/uploadFile`,
      params
    );
  }

  listFileResults(params): Observable<any> {
    params = params || {
      'batchid': '1234',
      'filename': '1.mp3'
    };
    return this.http.post(`${environment.api}/listFileResults`,
      params
    );
  }

}

