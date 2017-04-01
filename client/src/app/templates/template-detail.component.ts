import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Router, ActivatedRoute} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {TemplateService} from './template.service';
import {ITemplate} from "./template";
import {NotificationComponent} from "../shared/notification.component";

@Component({
    templateUrl: './template-detail.component.html'
})
export class TemplateDetailComponent implements OnInit, OnDestroy {
    tagInputSecondaryPlaceholder: string = "Añadir variables";
    tagInputPlaceholder: string = "Añadir mas variables";
    private sub: Subscription;
    ngForm: ITemplate;

    @ViewChild(NotificationComponent)
    private notificationComponent: NotificationComponent;

    constructor(private _templateService: TemplateService,
                private _route: ActivatedRoute,
                private _router: Router) {}

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.getTemplate(id);
            }
        )
    }
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    getTemplate(id:string) {
        this._templateService.getTemplate(id).subscribe(
            template => this.ngForm = template,
            error =>  this.notificationComponent.showMessage('error',error)
        );
    }

    sendForm(): void {
        this._templateService.editTemplate(this.ngForm)
            .subscribe(()=> this._router.navigate(['/templates']),
                error =>  this.notificationComponent.showMessage('error',error));
    }

    onBack(): void {
        this._router.navigate(['/templates']);
    }
}