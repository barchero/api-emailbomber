import {browser, by, element} from "protractor";
import * as path from 'path';

describe('Email Module', () => {

    var navBarLinks;
    beforeAll((done)=> {
        var navBar = element(by.tagName('nav'));
        navBarLinks = navBar.element(by.className('nav navbar-nav')).all(by.tagName('li'));
        done();
    });
    describe('Add new template', () => {
        var TemplateNewComponent;
        beforeAll((done) => {
            navBarLinks.get(1).$('a').click();
            element(by.id('TemplateListComponent'))
                .element(by.id('toTemplateNewComponent')).click();
            TemplateNewComponent = element(by.id('TemplateNewComponent'));
            done();
        });

        it('Fill form with data and save to server', () => {
            TemplateNewComponent.element(by.id('inputName')).sendKeys('Template Test');
            let absolutePath = path.resolve(__dirname, 'email-2.zip');

            TemplateNewComponent.$('input[type="file"]').sendKeys(absolutePath.toString());
            TemplateNewComponent.$('button[type="submit"]').click();
            let TemplateListComponent = element(by.id('TemplateListComponent'));
            expect(TemplateListComponent.isPresent()).toBeTruthy();
            expect(TemplateListComponent.$$('tr[name="templateList"]').count()).toBe(1);
        });
    });
    describe('Email Page', () => {
        var EmailComponent;
        beforeAll((done) => {
            navBarLinks.get(0).$('a').click();
            EmailComponent = element(by.id('EmailComponent'));
            done();
        });
        it('Can send test email', () => {
            EmailComponent.element(by.className('btn btn-warning')).getAttribute('disabled').then((disabled)=> {
                expect(disabled).toBeTruthy();
            });
            EmailComponent.$$('option').get(1).click();//select template
            EmailComponent.element(by.id('subject')).sendKeys('Test e2e: Riera Tutó');
            EmailComponent.element(by.className('btn btn-warning')).getAttribute('disabled').then((disabled)=> {
                expect(disabled).toBeFalsy();
                EmailComponent.element(by.className('btn btn-warning')).click();
                browser.sleep(1000);
                browser.ignoreSynchronization = true;
                let message = element(by.tagName('notificationcomponent'));
                expect(message.getText()).toContain('Email de test enviado correctamente');
                browser.sleep(500);
                browser.ignoreSynchronization = false;
            });
        });
    });
});