import {element, by, browser} from "protractor";
import * as path from "path";

describe('Templates Module', () => {
    var navBarLinks;
    var TemplateNewComponent;
    beforeAll((done)=> {
        navBarLinks = element(by.tagName('nav')).element(by.className('nav navbar-nav')).all(by.tagName('li'));
        done();
    });
    describe('Add new template', () => {
        beforeAll((done) => {
            navBarLinks.get(1).$('a').click();
            element(by.id('TemplateListComponent'))
                .element(by.id('toTemplateNewComponent')).click();
            TemplateNewComponent = element(by.id('TemplateNewComponent'));
            done();
        });
        it('Save button must be disabled', () => {
            TemplateNewComponent.$('button[type="submit"]')
                .getAttribute('disabled')
                .then((disabled) =>{
                    expect(disabled).toBeTruthy();
                });
        });

        it('Fill form with data and sent to server', () => {
            TemplateNewComponent.element(by.id('inputName')).sendKeys('Template Test');
            let absolutePath = path.resolve(__dirname, 'email-2.zip');

            TemplateNewComponent.$('input[type="file"]').sendKeys(absolutePath.toString());
            TemplateNewComponent.$('button[type="submit"]').click();
            let TemplateListComponent = element(by.id('TemplateListComponent'));
            expect(TemplateListComponent.isPresent()).toBeTruthy();
            expect(TemplateListComponent.$$('tr[name="templateList"]').count()).toBe(1);
        });
    });

    describe('Edit template data', () => {
        var TemplateDetailComponent;
        beforeAll((done) => {
            element.all(by.name("templateList")).get(0).$('a').click();
            TemplateDetailComponent = element(by.id('TemplateDetailComponent'));
            done();
        });

        it('Modify form data', () => {
            TemplateDetailComponent.element(by.id('name')).clear();
            TemplateDetailComponent.element(by.id('name')).sendKeys("Template Test 2");
            TemplateDetailComponent.$('button').click();
            expect(element(by.id('TemplateListComponent')).isPresent()).toBeTruthy();
            expect(element.all(by.name("templateList")).get(0).getText()).toContain("Template Test 2");
        });

    });

    describe('Delete template', ()=>{
        it('Press delete button in TemplateListComponent', () => {
            element.all(by.name("templateList")).count().then((currentTemplates) => {
                element.all(by.name("templateList")).get(0).$$('a').get(1).click();
                expect(element.all(by.name("templateList")).count()).toBe(currentTemplates-1);
            });
        })
    });

});
