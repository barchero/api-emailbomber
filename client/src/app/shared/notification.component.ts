import {Component} from "@angular/core";
@Component({
    selector: 'NotificationComponent',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent{
    notificationType: string;
    message: string;
    errorClass: string = 'errorComponent';

    showMessage(type: string, message: string){
        this.notificationType = type;
        this.message = message;
        this.toggleVisibility(7, () => {
            this.notificationType = undefined;
            this.message = undefined;
        });
    }

    toggleVisibility(time:number, cb:any): void {
        if(this.message && this.notificationType) {
            setTimeout(() => {
                this.errorClass = 'errorComponent visible';
                setTimeout(() => {
                    this.errorClass = 'errorComponent';
                    setTimeout(()=>{
                        cb();
                    }, 600);
                }, time*1000);
            }, 100);
        }

    }
}