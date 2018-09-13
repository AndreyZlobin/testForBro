import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { UsersService } from '../services/users.service';

@Injectable()
export class RequestsHttpInterceptor implements HttpInterceptor {
  meta: any;
  constructor(
    private router: Router,
    private usersService: UsersService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url: string = request.url;
    const method: string = request.method;
    const urlWithParams: string = request.urlWithParams;
    const token = this.usersService.getToken();
    const apikey = this.usersService.getApiKey();
    const newRequest = token && apikey
      ? request.clone({ setHeaders: {
        'Authorization': token,
        'x-api-key': apikey.replace(/\"/g, ''),
      } })
      : request;
console.log(newRequest);
    return next
      .handle(newRequest).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // redirect to the login route
            // or show a modal
            this.router.navigateByUrl('/');
          }
        }
      });
  }
}
