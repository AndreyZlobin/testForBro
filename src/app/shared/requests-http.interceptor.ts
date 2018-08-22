import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/throw';
import { UsersService } from '../services/users.service';

@Injectable()
export class RequestsHttpInterceptor implements HttpInterceptor {
  meta: any;
  constructor(
    private router: Router,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url: string = request.url;
    const method: string = request.method;
    const urlWithParams: string = request.urlWithParams;
    const token = UsersService.getToken();
    const apikey = UsersService.getApiKey();
    const newRequest = token
      ? request.clone({ setHeaders: {
        'Authorization': token,
        'x-api-key': apikey
      } })
      : request;

    return next
      .handle(newRequest);
  }
}
