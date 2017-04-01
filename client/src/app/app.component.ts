import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <div>
        <nav class='navbar navbar-default'>
            <div class='container-fluid'>
                <a class='navbar-brand'>{{pageTitle}}</a>
                <ul class='nav navbar-nav'>
                    <li><a [routerLink]="['/email']">Inicio</a></li>
                    <li><a [routerLink]="['/templates']">Plantillas</a></li>
                    <li><a [routerLink]="['/configuration']">Configuración</a></li>
                </ul>
            </div>
        </nav>
        <div class='container'>
            <router-outlet></router-outlet>
        </div>
     </div>
     `
})
export class AppComponent {
    pageTitle: string = 'Riera Tutó S.L.';
}
