import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'datex'
})

export class DatexPipe implements PipeTransform {
    transform(value: string, format: string = ""): string {
        if (!value || value==="") return "";
        let date = new Date(value).toISOString();
        return moment(date).format(format);
    }
}