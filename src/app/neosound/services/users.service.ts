import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }
  getToken(): string {
    const user = this.getUserLocal();
    return user && user.token
      || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZyb250dHJ1c3QiLCJhcGlrZXkiOiJHUUJpOFFGTFZQYUlQcnJNbUNwRE5CV3F3UGZNWWRNMnRlUFRpcFNoIiwiaWF0IjoxNTM2NTE1ODQ5Njg2LCJleHAiOiIyMDIzLTA5LTA4VDE3OjU3OjI5LjY4NloifQ.rfygroLBG_7p_R-EiPUL8nsc3wDUcGE2cfNiCHv1uDA';
  }
  getApiKey(): string {
    const apikey = localStorage.getItem('apikey');
    return apikey || 'GQBi8QFLVPaIPrrMmCpDNBWqwPfMYdM2tePTipSh';
  }
  getUserLocal() {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user);
  }

  loginUser(params): Observable<any> {
    return this.http.post(`${environment.api}/loginUser`,
      params
    ).map((user: any) => {
      localStorage.setItem('user', JSON.stringify(user));
      const helper = new JwtHelperService();
      const token = helper.decodeToken(user.token);
      token && localStorage.setItem('apikey', JSON.stringify(token.apikey));
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
}
