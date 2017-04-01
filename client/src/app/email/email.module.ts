import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { EmailComponent } from './email.component';

import { EmailService } from './email.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: 'email', component: EmailComponent },
        ])
    ],
    declarations: [
        EmailComponent,
    ],
    providers: [
        EmailService,
    ]
})
export class EmailModule {}