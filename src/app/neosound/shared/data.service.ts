import { AutoTagCloudService } from './../pages/dashboard/calls-dashboard/services/auto-tag-cloud.service';
import { TopicCloudService } from './../pages/dashboard/calls-dashboard/services/topic-cloud.service';
import { TagCloudService } from './../pages/dashboard/calls-dashboard/services/tag-cloud.service';
import { MinutesStatsService } from './../pages/dashboard/calls-dashboard/services/minutes-stats.service';
import { DashboardFileStatsService } from './../pages/dashboard/calls-dashboard/services/file-stats.service';
import { ChartDataService } from './../pages/dashboard/calls-dashboard/services/chart-data.service';
import { ApiCallsStatsService } from './../pages/dashboard/calls-dashboard/services/api-calls-stats.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IFilterData {
    batches: any;
    dateFrom: any;
    dateTo: any;
    dateModel: any;
}

@Injectable()
export class DataService {

    private _filterData = new BehaviorSubject<IFilterData>({
        batches: [],
        dateFrom: null,
        dateTo: null,
        dateModel: []
    });

    readonly filterData$: Observable<any>;

    constructor(
        private http: HttpClient,
        private apiCallsStatsService: ApiCallsStatsService,
        private chartDataService: ChartDataService,
        private dashboardFileStatsService: DashboardFileStatsService,
        private minutesStatsService: MinutesStatsService,
        private tagCloudService: TagCloudService,
        private topicCloudService: TopicCloudService,
        private autoTagCloudService: AutoTagCloudService,
    ) {
        this.filterData$ = this._filterData.asObservable();
    }

    getUsers() {
        return this.http.get('http://localhost:3000/users');
    }

    getData() {
        return this.http.get('http://localhost:3000/data');
    }

    loadData({dateFrom, dateTo, batches}) {
        const source = "audio";
        this.apiCallsStatsService.load(source, dateFrom, dateTo, batches);
        this.chartDataService.load(source, dateFrom, dateTo, batches);
        this.dashboardFileStatsService.load(source, dateFrom, dateTo, batches);
        this.minutesStatsService.load(source, dateFrom, dateTo, batches);
        this.tagCloudService.load(source, dateFrom, dateTo, batches);
        this.topicCloudService.load(source, dateFrom, dateTo, batches);
        this.autoTagCloudService.load(source, dateFrom, dateTo, batches);
      }

    loadConfig() {
        return this.http.get<any>('assets/config/config.json');
    }

    set filterData(val: IFilterData) {
        this._filterData.next(val);
    }

    get filterData(): IFilterData {
        return this._filterData.getValue();
    }

    public config = {
        "title": "NeoSound - Turn emotions into data!",
        "metaDescription": "NeoSound - Turn emotions into data!",
        "logofilename": "logo.jpg",
        "footer": {
            "title": {
                "show": true,
                "text": "Created with ♥ by",
                "link": "http://neosound.eu",
                "name": "NeoSound"
            },
            "terms": {
                "show": true,
                "text": "Terms of Use",
                "link": "/terms"
            },
            "about": {
                "show": true,
                "text": "About",
                "link": "https://neosound.eu/"
            }
        },
        "header": {
            "api": {
                "show": true,
                "text": "API",
                "link": "/user/api"
            },
            "about": {
                "show": true,
                "text": "About",
                "link": "https://neosound.eu/"
            },
            "language": {
                "show": true
            }
        }
    };

}
