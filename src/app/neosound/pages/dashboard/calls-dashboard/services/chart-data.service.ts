import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class ChartDataService {
  private dataStore: any = {};
  private dataSubject = new BehaviorSubject<any>({});
  public data = this.dataSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public load(source: string, dateFrom: Date, dateTo: Date, batches: string[]) {
    this.dataSubject.next(null);
    this.filesService
      .getEchartData(this.getParams(source, dateFrom, dateTo, batches))
      .subscribe(data => {
        this.dataSubject.next(data);
      });
  }
  getParams(source: string, dateFrom: Date, dateTo: Date, batches: string[]) {
    const params = {};
    if (source) {
      params["source"] = source;
    }
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
