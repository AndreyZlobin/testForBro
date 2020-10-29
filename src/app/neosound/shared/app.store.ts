import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import { DataService } from './data.service';

@Injectable({providedIn: 'root'})
export class AppStoreService {

  constructor(private dataService: DataService) { }

  private readonly _config = new BehaviorSubject<any>(null);

  readonly config$ = this._config.asObservable();

  get config(): any {
    return this._config.getValue();
  }

  set config(val: any) {
    this._config.next(val);
  }

  async fetchConfig() {
    this.config = await this.dataService.loadConfig().toPromise();
    this.dataService.config = this.config;
    return this.config;
  }
}