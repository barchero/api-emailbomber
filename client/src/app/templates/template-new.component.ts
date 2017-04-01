import {Component, ViewChild} from "@angular/core";

import {TemplateService} from './template.service';
import {Router} from "@angular/router";
import {NotificationComponent} from "../shared/notification.component";

@Component({
    templateUrl: './template-new.component.html'
})
export class TemplateNewComponent {
    pageTitle: string = "Plantilla Nueva";
    tagInputSecondaryPlaceholder: string = "Añadir variables";
    tagInputPlaceholder: string = "Añadir mas variables";
    inputFile: File;
    formData: any = {};

    @ViewChild(NotificationComponent)
    private notificationComponent: NotificationComponent;

    constructor(private _templateService: TemplateService,
                private _router: Router) {}

    fileChangeEvent(fileInput: any){
        this.inputFile = fileInput.target.files;
    }
    sendForm(values: any): void {
        this.formData.variables = [];
        for(let val of values.inputVariables){
            this.formData.variables.push(val.value);
        }
        this.formData.name = values.inputName;

        this._templateService.addTemplate(this.formData, this.inputFile)
            .subscribe(() => this._router.navigate(['/templates']),
                error => this.notificationComponent.showMessage('error',error));
    }
    onBack(): void {
        this._router.navigate(['/templates']);
    }
}