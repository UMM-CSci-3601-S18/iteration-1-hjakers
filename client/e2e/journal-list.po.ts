import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class JournalPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/journals');
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getJournalTitle() {
        const title = element(by.id('journal-list-title')).getText();
        this.highlightElement(by.id('journal-list-title'));

        return title;
    }

    typeATitle(title: string) {
        const input = element(by.id('JournalTitle'));
        input.click();
        input.sendKeys(title);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getBody(body: string) {
        const input = element(by.id('journalBody'));
        input.click();
        input.sendKeys(body);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }



    getUniqueJournal(_id: string) {
        const Journal = element(by.id(_id)).getText();
        this.highlightElement(by.id(_id));

        return Journal;
    }

    getJournals() {
        return element.all(by.className('journals'));
    }



    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).isPresent();
    }

    clickAddJournalButton(): promise.Promise<void> {
        this.highlightElement(by.id('add-icon-journal'));
        return element(by.id('add-icon-journal')).click();
    }



}
