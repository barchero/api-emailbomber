import {Injectable} from '@angular/core';
import {Http,Request, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import config from '../config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class HttpService extends Http {
    request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url !== 'string') {
                url.url = config.backendURL+url.url;
        }
        return super.request(url, options)
    }
    XHR(url: string|Request, options?: RequestOptionsArgs, formData?: FormData): Observable<Response> {
        let templateUrl: string;
        let method: any = options && options.method ? options.method : 'GET';
        if (typeof url === 'string') {
            templateUrl = config.backendURL+url;
        }else{
            templateUrl = config.backendURL+url.url;
        }

        return Observable.fromPromise(new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if(xhr.status === 200){
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open(method, templateUrl, true);
            xhr.send(formData);
        }));
    }
}