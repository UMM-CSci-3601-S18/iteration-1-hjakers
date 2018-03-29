import {HomePage} from './home.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

/*const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function() {
    var args = arguments;

    // queue 100ms wait
    origFn.call(browser.driver.controlFlow(), function() {
        return browser.promise.delayed(100);
    });

    return origFn.apply(browser.driver.controlFlow(), args);
};*/

describe('Home page', () => {
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();

        it('should select an emotion display the correct value', () => {
            HomePage.navigateTo();
            page.selectAnEmoji('mad');
            expect(page.getCurrentInput()).toContain('value: mad');
        })

        it('Should have a save button', () => {
            HomePage.navigateTo();
            expect(page.saveButtonExists()).toBeTruthy();
        });

        it('Should have a cancel button', () => {
            HomePage.navigateTo();
            expect(page.cancelButtonExists()).toBeTruthy();
        });

    });

})

