import { Injectable } from '@angular/core';
import {Response} from '@angular/http';
import {HttpService} from '../http.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class ConfigurationService {

    constructor(private _http: HttpService) { }

    getConfiguration(): Observable<any>{
        let configurationUrl = 'api/config';
        return this._http.get(configurationUrl)
            .map((response: any) => <any> response.json())
            .catch(this.handleError);
    }

    saveConfiguration(config: any): Observable<any>{
        let configurationUrl = 'api/config';
        return this._http.post(configurationUrl, config)
            .map((response: any) => <any> response.json())
            .catch(this.handleError);
    }

    editTemplate(template: any): Observable<any>{
        let templateUrl = 'api/templates/'+template.id;
        return this._http.put(templateUrl, template)
            .map((response: Response) => <any> response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
