
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Router } from '@angular/router';

@Injectable()
export class UsersService {
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    const helper = new JwtHelperService();
    const user = this.getUserLocal();
    if (user && (new Date().getTime() - user.time > 2 * 24 * 60 * 60 * 1000)) {
      localStorage.removeItem('apikey');
      localStorage.removeItem('user');
      this.router.navigateByUrl('/auth/login');
    }
    return user; // && !helper.isTokenExpired(token);
  }
  getToken(): string {
    const user = this.getUserLocal();
    return user && user.token
  }
  getApiKey(): string {
    const apikey = localStorage.getItem('apikey');
    return apikey;
  }
  getUserLocal() {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user);
  }

  loginUser(params): Observable<any> {
    return this.http.post(`${environment.api}/loginUser`,
      params
    ).pipe(map((user: any) => {
      user.time = new Date().getTime();
      localStorage.setItem('user', JSON.stringify(user));
      const helper = new JwtHelperService();
      const token = helper.decodeToken(user.token);
      token && localStorage.setItem('apikey', JSON.stringify(token.apikey));
      const { settings } = user;
      settings && localStorage.setItem('settings', JSON.stringify(settings));
      setTimeout(() => {
        localStorage.removeItem('apikey');
        localStorage.removeItem('user');
        this.router.navigateByUrl('/auth/login');
      }, 2 * 24 * 60 * 60 * 1000);
    }));
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

  registerUser(params): Observable<any> {
    params = params || {
      'username': '',
      'firstname': '',
      'lastname': '',
      'email': '',
    };
    return this.http.post(`${environment.api}/registerUser`, params);
  }

  getUser(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/getUser`,
      params
    );
  }

  forgotPassword(params): Observable<any> {
    params = params || {};
    return this.http.post(`${environment.api}/forgotPassword`,
      params
    );
  }

  addMessage(m) {
    this.message = m;
  }

  getMessage() {
    const m = this.message;
    this.message = '';
    return m;
  }
}
