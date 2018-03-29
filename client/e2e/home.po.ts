import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';



export class HomePage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/home');
    }

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

    getCurrentInput() {
        const elem = element(by.id('userInputDisplay'));
        return elem.getText();
    }

    selectAnEmoji(emotion: string) {
        const input = element(by.id(emotion));
        input.click();
    }

    saveButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('save'));
        return element(by.id('save')).isPresent();
    }

    cancelButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('cancel'));
        return element(by.id('cancel')).isPresent();
    }

}

