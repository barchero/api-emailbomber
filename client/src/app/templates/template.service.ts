import { Injectable } from '@angular/core';
import {Response} from '@angular/http';
import {HttpService} from '../http.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ITemplate } from './template';

@Injectable()
export class TemplateService {

    constructor(private _http: HttpService) { }

    getTemplates(): Observable<ITemplate[]> {
        let templateUrl = 'api/templates/';
        return this._http.get(templateUrl)
            .map((response: Response) => <ITemplate[]> response.json())
            .catch(this.handleError);
    }

    getTemplate(id: string): Observable<ITemplate> {
        return this.getTemplates().map((templates: ITemplate[]) => templates.find(t => t.id === id));
    }

    addTemplate(params: string[], fileList: File): Observable<any>{
        let templateUrl = 'api/templates/';
        let formData: FormData = new FormData();
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        if(fileList !== undefined) {
            let file: File = fileList[0];
            formData.append('file', file, file.name);
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
        return this._http.XHR(templateUrl, {method: 'POST'}, formData);

    }

    editTemplate(template: ITemplate): Observable<ITemplate>{
        let templateUrl = 'api/templates/'+template.id;
        return this._http.put(templateUrl, template)
            .map((response: Response) => <ITemplate> response.json())
            .catch(this.handleError);
    }

    removeTemplate(template: ITemplate): Observable<ITemplate>{
        let templateUrl = 'api/templates/'+template.id;
        return this._http.delete(templateUrl)
            .map(() => <ITemplate> template)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
