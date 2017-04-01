import {Component, OnInit, ViewChild} from "@angular/core";
import {ConfigurationService} from './configuration.service';
import {NotificationComponent} from "../shared/notification.component";


@Component({
    templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {
    panelHeading: string = "Configuración";
    config: any;

    @ViewChild(NotificationComponent)
    private notificationComponent: NotificationComponent;

    constructor(private _configurationService: ConfigurationService) {}

    ngOnInit(): void {
        this._configurationService.getConfiguration().subscribe(
            values => this.config = values,
            error => this.notificationComponent.showMessage('error', error)
        )
    }
    sendForm(): void {
        this.config.port = +this.config.port;
        this._configurationService.saveConfiguration(this.config).subscribe(
            values => this.notificationComponent.showMessage('success', 'Valores guardados en el servidor correctamente.'),
            error => this.notificationComponent.showMessage('error', error)
        );
    }
}