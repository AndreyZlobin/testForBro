import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class ChecklistStatsService {
  private dataStore: any = {};
  private dataSubject = new BehaviorSubject<any>({});
  public data = this.dataSubject.asObservable();

  constructor(private filesService: FilesService) {}

  public load(dateFrom: Date, dateTo: Date, batches: string[]) {
    this.dataSubject.next(null);
    this.filesService
      .getChecklistStats(this.getParams(dateFrom, dateTo, batches))
      .subscribe(data => {
        this.dataSubject.next(data);
      });
  }

  getParams(dateFrom: Date, dateTo: Date, batches: string[]) {
    const params = {};
    if (dateFrom) {
      params["dateFrom"] = dateFrom;
    }
    if (dateTo) {
      params["dateTo"] = dateTo;
    }
    if (batches) {
      params["batches"] = batches;
    }
    return params;
  }
}
