import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class OrganizationSettingsService {
  constructor(private http: HttpClient) {}

  getKeyWordSettings(nameSpace: string): Observable<any> {
    const params = {
      setting: nameSpace
    };
    return this.http.post(`${environment.api}/getMyCompanySettings`, params);
  }

  updateSettings(nameSpace: string, settings: any): Observable<any> {
    const params = {
      settings: {}
    };
    params.settings[`${nameSpace}`] = settings;
    return this.http.post(`${environment.api}/updateMyCompanySettings`, params);
  }

  getSensitiveDataSettings(): Observable<any> {
    const params = {
      setting: "sensitive"
    };
    return this.http.post(`${environment.api}/getMyCompanySettings`, params);
  }
}
