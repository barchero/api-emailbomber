import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import {TagInputModule} from "ng2-tag-input";

import { SharedModule } from '../shared/shared.module';
import {ConfigurationComponent} from "./configuration.component";
import {ConfigurationService} from "./configuration.service";


@NgModule({
    imports: [
        SharedModule,
        TagInputModule,
        RouterModule.forChild([
            { path: 'configuration', component: ConfigurationComponent }
        ]),
    ],
    declarations: [
        ConfigurationComponent
    ],
    providers: [
        ConfigurationService,
    ]
})
export class ConfigurationModule {}
