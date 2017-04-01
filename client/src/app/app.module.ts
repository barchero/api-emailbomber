import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
/* Feature Modules */
import {TemplateModule} from "./templates/template.module";
import {EmailModule} from "./email/email.module";
import {ConfigurationModule} from './config/configuration.module';
import {HttpService} from "./http.service";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    TemplateModule,
    EmailModule,
    ConfigurationModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'email', pathMatch: 'full' },
      { path: '**', redirectTo: 'email', pathMatch: 'full' }
    ]),
  ],
  providers: [
    {
      provide: HttpService,
      useClass: HttpService,
      deps: [XHRBackend, RequestOptions]
    }
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
