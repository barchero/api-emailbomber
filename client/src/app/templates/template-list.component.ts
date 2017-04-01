import {Component, OnInit, ViewChild}  from '@angular/core';

import { ITemplate } from './template';
import { TemplateService } from './template.service';
import {NotificationComponent} from "../shared/notification.component";

@Component({
    templateUrl: './templates-list.component.html',
    styleUrls: ['./templates-list.component.css']
})
export class TemplateListComponent implements OnInit {
    pageTitle: string = 'Lista de plantillas';
    listFilter: string;
    templates: ITemplate[];

    @ViewChild(NotificationComponent)
    private notificationComponent: NotificationComponent;

    constructor(private _templateService: TemplateService) {}

    ngOnInit(): void {
        this._templateService.getTemplates()
            .subscribe(templates => this.templates = templates,
                error =>  this.notificationComponent.showMessage('error',error));
    }

    removeTemplate(template: ITemplate): void {
        this._templateService.removeTemplate(template)
            .subscribe((response)=>{
                if(this.templates.indexOf(response) !== -1) {
                    this.templates.splice(this.templates.indexOf(response), 1);
                }
            }, error =>  this.notificationComponent.showMessage('error',error));
    }
}
