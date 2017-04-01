import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import {TagInputModule} from "ng2-tag-input";

import { SharedModule } from '../shared/shared.module';
import {TemplateListComponent} from "./template-list.component";
import {TemplateService} from "./template.service";
import {TemplateFilterPipe} from "./template-filter.pipe";
import {TemplateNewComponent} from "./template-new.component";
import {TemplateDetailComponent} from "./template-detail.component";

@NgModule({
    imports: [
        SharedModule,
        TagInputModule,
        RouterModule.forChild([
            { path: 'templates', component: TemplateListComponent },
            { path: 'templates/new', component: TemplateNewComponent },
            { path: 'template/:id', component: TemplateDetailComponent}
            /*{ path: 'product/:id',
                canActivate: [ ProductDetailGuard],
                component: ProductDetailComponent
            }*/
        ]),
    ],
    declarations: [
        TemplateListComponent,
        TemplateNewComponent,
        TemplateDetailComponent,
        TemplateFilterPipe
    ],
    providers: [
        TemplateService,
    ]
})

/*export interface Route {
 path?: string;
 pathMatch?: string;
 component?: Type<any>;
 redirectTo?: string;
 outlet?: string;
 canActivate?: any[];
 canActivateChild?: any[];
 canDeactivate?: any[];
 canLoad?: any[];
 data?: Data;
 resolve?: ResolveData;
 children?: Route[];
 loadChildren?: LoadChildren;
 }*/
export class TemplateModule {}
