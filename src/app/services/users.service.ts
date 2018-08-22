import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  getToken(): string {
    const user = this.getUserLocal();
    return user && user.token;
  }
  getApiKey(): string {
    const user = this.getUserLocal();
    return user && user.apikey;
  }
  getUserLocal() {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user);
  }

  loginUser(params): Observable<any> {
    params = params || {
      'username': 'mathematica',
      'password': 'mathematica'
    };
    return this.http.post(`${environment.api}/loginUser`,
      params
    ).map(user => {
      localStorage.setItem('user', JSON.stringify(user));
    });
    // .flatMap((response: any) => {
    //   return Observable.of(response);
    // });
  }

  createUser(params): Observable<any> {
    params = params || {
      'username': '',
      'firstname': '',
      'lastname': '',
      'email': ''
    };
    return this.http.post(`${environment.api}/createUser`,
      params
    );
  }

  getUser(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/getUser`,
      params
    );
  }
}
