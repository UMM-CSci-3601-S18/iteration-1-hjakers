import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class GoalPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/goals');
    }

    static getGoals() {
        return element.all(by.className('goals'));
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

    getGoalTitle() {
        const title = element(by.id('your-goals')).getText();
        this.highlightElement(by.id('your-goals'));

        return title;
    }


    getUniqueGoal(name: string) {
        const goals = element(by.id(name)).getText();
        this.highlightElement(by.id(name));

        return goals;
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('add-icon'));
        return element(by.id('add-icon')).isPresent();
    }

    clickAddGoalButton(): promise.Promise<void> {
        this.highlightElement(by.id('add-icon'));
        return element(by.id('add-icon')).click();
    }

}
