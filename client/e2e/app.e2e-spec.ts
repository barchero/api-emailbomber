import {browser, element, by} from 'protractor';
import * as fs from "fs";
import * as path from "path";

var Utils = {

  /**
   * @name screenShotDirectory
   * @description The directory where screenshots will be created
   * @type {String}
   */
  screenShotDirectory:path.join(__dirname, 'screenshots'),

  /**
   * @name writeScreenShot
   * @description Write a screenshot string to file.
   * @param {String} data The base64-encoded string to write to file
   * @param {String} filename The name of the file to create (do not specify directory)
   */
  writeScreenShot:function (data, filename) {
    var stream = fs.createWriteStream(this.screenShotDirectory + filename);

    stream.write(new Buffer(data, 'base64'));
    stream.end();
  }

};


describe('client App', () => {
  var screenshot = 0;
  afterEach(function() {
    browser.takeScreenshot().then(function (png) {
      var filename = '/screenshot_'+screenshot+'.png';
      Utils.writeScreenShot(png, filename);
      screenshot++;
    });
  });

  var navBar = element(by.tagName('nav'));
  var navBarLinks = navBar.element(by.className('nav navbar-nav')).all(by.tagName('li'));
  browser.get('/');
  it('should display EmailComponent', () => {
    navBarLinks.get(0).$('a').click();

    let EmailComponent = element(by.id('EmailComponent'));
    expect(EmailComponent.isPresent()).toBeTruthy();

  });
  it('should display TemplateListComponent', () => {
    navBarLinks.get(1).$('a').click();

    let TemplateListComponent = element(by.id('TemplateListComponent'));
    expect(TemplateListComponent.isPresent()).toBeTruthy();
  });

  it('should display TemplateDetailComponent', () => {
    navBarLinks.get(1).$('a').click();

    let TemplateListComponent = element(by.id('TemplateListComponent'));
    expect(TemplateListComponent.isPresent()).toBeTruthy();

    element.all(by.name("templateList")).get(0).$('a').click();

    let TemplateDetailComponent = element(by.id('TemplateListComponent'));

    expect(TemplateDetailComponent.isPresent()).toBeTruthy();
  });

  it('should display TemplateNewComponent', () => {
    navBarLinks.get(1).$('a').click();
    let newComponentButton = element(by.id('toTemplateNewComponent'));

    expect(newComponentButton.isPresent()).toBeTruthy();

    newComponentButton.click();

    let TemplateNewComponent = element(by.id('TemplateNewComponent'));
    expect(TemplateNewComponent.isPresent()).toBeTruthy();
  });

  it('should display ConfigurationComponent', () => {
    navBarLinks.get(2).$('a').click();

    let ConfigurationComponent = element(by.id('ConfigurationComponent'));
    expect(ConfigurationComponent.isPresent()).toBeTruthy();
  });


});
