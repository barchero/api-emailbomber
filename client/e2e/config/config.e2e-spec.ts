import {element, by, browser} from "protractor";

describe('Configuration Module', () => {
    var navBar = element(by.tagName('nav'));
    var navBarLinks = navBar.element(by.className('nav navbar-nav')).all(by.tagName('li'));
    var ConfigurationComponent = element(by.id('ConfigurationComponent'));
    navBarLinks.get(2).$('a').click();
    it('All fields must be blank', () => {
        ConfigurationComponent.$$('input')
            .map((field)=> {
                field.getAttribute('value').then((value) => {
                    expect(value.length == 0 || value.toString() == '0').toBeTruthy();
                });
            });
    });

    it('Save button must be disabled', () => {
       let button = ConfigurationComponent.$('button');
       button.getAttribute('disabled').then((disabled)=>{
           expect(disabled).toBeTruthy();
       });
    });

    it('Fill form and send to server', () => {
        var i = 0;
        var values = [
            '',//smtp
            '0',//port
            '',//smtp user auth,
            '',//smtp user password,
            '',//User name
            '',//User email
            ''//email to send tests
        ];
       ConfigurationComponent.$$('input')
           .map((field)=> {
                field.clear();
                field.sendKeys(values[i]);
                i++;
           })
           .then(()=> {
                let button = ConfigurationComponent.$('button');
                button.getAttribute('disabled').then((disabled)=> {
                    expect(disabled).toBeFalsy();
                    button.click();
                    browser.sleep(500);
                    browser.ignoreSynchronization = true;
                    let message = element(by.tagName('notificationcomponent'));
                    expect(message.getText()).toContain('Valores guardados en el servidor correctamente.');
                    browser.sleep(500);
                    browser.ignoreSynchronization = false;
                });
           })

    });
});