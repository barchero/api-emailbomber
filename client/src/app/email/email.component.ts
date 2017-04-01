import {Component, OnInit, ViewChild} from "@angular/core";
import {EmailService} from './email.service';
import {ITemplate} from "./template";
import {NotificationComponent} from "../shared/notification.component";

@Component({
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit{
    pageTitle: string = "Enviar Emails";
    templates: ITemplate[];
    selectedTemplate: ITemplate;
    csvFile: File;
    attachmentsFile: File[];
    ngForm: any = {};

    @ViewChild(NotificationComponent)
    private notificationComponent: NotificationComponent;

    constructor(private _emailService: EmailService){}

    ngOnInit(): void {
        this._emailService.getTemplates().subscribe(templates => this.templates = templates,
            error => this.notificationComponent.showMessage('error',error))
    }
    changeTab(event:any) {
        this.ngForm.method = event.srcElement.hash;
    }
    changeTemplate(event: any){
        for(let i = 0; i < this.templates.length; i++){
            let template = this.templates[i];
            if(event.srcElement.value == template.id){
                this.selectedTemplate = template;
            }
        }
    }
    addCSV(event: any){
        this.csvFile = event.target.files;
    }
    addAttachments(event: any){
        this.attachmentsFile = event.target.files;
    }

    sendEmail(values: any){
        this.ngForm = Object.assign({}, this.ngForm, values);
        this._emailService.sendEmail(this.ngForm, this.attachmentsFile, this.csvFile)
            .subscribe((result) => this.notificationComponent.showMessage('success',"Email enviado correctamente"),
                error => this.notificationComponent.showMessage('error',error));
    }
    sendTest(values: any){
       this._emailService.getTestEmail()
           .subscribe(
               (testEmail) => {
                   let emailData = Object.assign({}, values);
                   emailData.to = testEmail;
                   delete emailData.cc;
                   delete emailData.cco;
                   this._emailService.sendEmail(emailData, this.attachmentsFile, undefined)
                       .subscribe((result) => this.notificationComponent.showMessage('success',"Email de test enviado correctamente"), error => this.notificationComponent.showMessage('error',error));
               },
               error => this.notificationComponent.showMessage('error',error)
           )
    }
}