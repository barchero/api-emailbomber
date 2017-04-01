import {  PipeTransform, Pipe } from '@angular/core';
import { ITemplate } from './template';

@Pipe({
    name: 'templateFilter'
})
export class TemplateFilterPipe implements PipeTransform {

    transform(value: ITemplate[], filterBy: string): ITemplate[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((template: ITemplate) =>
            template.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
