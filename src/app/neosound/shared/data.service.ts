import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

    constructor(private http: HttpClient) {}

    getUsers() {
        return this.http.get('http://localhost:3000/users');
    }

    getData() {
        return this.http.get('http://localhost:3000/data');
    }

    public config = {
        "title": "NeoSound - Turn emotions into data!",
        "metaDescription": "NeoSound - Turn emotions into data!",
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
