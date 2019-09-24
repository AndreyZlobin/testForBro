import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class FilterService {
  private filesSubject = new BehaviorSubject<any[]>([]);
  public files = this.filesSubject.asObservable();
  public filter: any = {
  };
  constructor() {}

  updateFileList(): void {}

  getFilter() {}
}
