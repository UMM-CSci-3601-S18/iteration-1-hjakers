import {GoalPage} from './goal-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Goal list', () => {
    let page: GoalPage;

    beforeEach(() => {
        page = new GoalPage();
    });

    it('should get and highlight Goals title attribute ', () => {
        GoalPage.navigateTo();
        expect(page.getGoalTitle()).toEqual('Your Goals');
    });

    it('Should have an add goal button', () => {
        GoalPage.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should have 5 goals', () => {
        GoalPage.navigateTo();
        GoalPage.getGoals().then(function(goals) {
            expect(goals.length).toBe(5);
        });
    });

    it('Should have the goal Wash the dishes', () => {
        GoalPage.navigateTo();
        expect(page.getUniqueGoal('Wash the dishes.')).toMatch('Wash the dishes.');
    });

    it('Should open a dialog box when add goal button is clicked', () => {
        GoalPage.navigateTo();
        expect(element(by.css('createGoal')).isPresent()).toBeFalsy('There should not be a modal window yet');
    });

    it('Should actually add the goal with the information we put in the fields', () => {
        GoalPage.navigateTo();
        page.clickAddGoalButton();
        element(by.id('nameField')).sendKeys('Study 10 hours');
        element(by.id('categoryField')).sendKeys('Study');
        element(by.id('purposeField')).sendKeys('To get a C');
        element(by.id('confirmAddGoalButton')).click();
        setTimeout(() => {
            expect(page.getUniqueGoal('Study 10 hours')).toMatch('Study 10 hours');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add goal dialog', () => {
        GoalPage.navigateTo();
        page.clickAddGoalButton();
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be a name field');
        element(by.id('nameField')).sendKeys('Sleep 8 hours');
        expect(element(by.id('categoryField')).isPresent()).toBeTruthy('There should be an age field');
        element(by.id('categoryField')).sendKeys('Sleep');
        expect(element(by.id('purposeField')).isPresent()).toBeTruthy('There should be a company field');
        element(by.id('purposeField')).sendKeys('Get enough sleep');
        element(by.id('exitWithoutAddingButton')).click();
    });
});
