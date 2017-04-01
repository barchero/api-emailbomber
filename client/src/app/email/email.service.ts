import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from '../http.service';
import {ITemplate} from "./template";

import {Observable} from "rxjs/Rx";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class EmailService {
    constructor(private _http: HttpService) { }

    getTemplates(): Observable<ITemplate[]> {
        let templateUrl = 'api/templates';
        return this._http.get(templateUrl)
            .map((response: Response) => <ITemplate[]> response.json())
            .catch(this.handleError);
    }

    getTestEmail(): Observable<string> {
        let configurationUrl = 'api/config';
        return this._http.get(configurationUrl)
            .map((response: Response) => <string> response.json().testTo)
            .catch(this.handleError);
    }

    sendEmail(params: any, attachments: File[], csv: File): Observable<any> {
        let templateUrl = 'api/email/';
        let formData: FormData = new FormData();

        if(params.method == '#csv') {
            let newParams = {
                template: params.template,
                subject: params.subject
            };
            params = Object.assign({}, newParams);
            formData.append('csv', csv[0], csv[0].name);
        }
        if(attachments !== undefined) {
            let files: File[] = attachments;
            for (let i = 0; i < files.length; i++) {
                formData.append('attachments[' + i + ']', files[i], files[i].name);
            }
        }

        for(let key in params){
            if(params.hasOwnProperty(key)){
                if(typeof params[key] == 'object'){
                    formData.append(key, JSON.stringify(params[key]));
                }else {
                    formData.append(key, params[key]);
                }
            }
        }

        return this._http.XHR(templateUrl, {method:'POST'}, formData);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}