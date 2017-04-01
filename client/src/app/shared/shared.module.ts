import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotificationComponent} from "./notification.component";
import {DatexPipe} from "./datex.pipe";
@NgModule({
  imports: [
    CommonModule
  ],
  exports : [
    CommonModule,
    FormsModule,
    NotificationComponent,
    ReactiveFormsModule,
    DatexPipe
  ],
  declarations: [ NotificationComponent, DatexPipe ]
})
export class SharedModule { }
