import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Goal} from './goal';
import {GoalsService} from './goals.service';

describe('Goal service: ', () => {
    // A small collection of test goals
    const testGoals: Goal[] = [
        {
            _id: '1',
            goal: 'To have a more sanitary living environment.',
            category: 'Chores',
            name: 'Wash the dishes',
        },
        {
            _id: '2',
            goal: 'To be beefy.',
            category: 'Workout',
            name: 'Go to gym',
        },
        {
            _id: '3',
            goal: 'To have a safer driveway.',
            category: 'Chores',
            name: 'Shovel driveway',
        }
    ];
    const mGoals: Goal[] = testGoals.filter(goal =>
        goal.name.toLowerCase().indexOf('o') !== 2
    );

    // We will need some url information from the goalService to meaningfully test category filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let goalService: GoalsService;
    let currentlyImpossibleToGenerateSearchGoalUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        goalService = new GoalsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getGoals() calls api/goals', () => {
        // Assert that the goals we get from this call to getGoals()
        // should be our set of test goals. Because we're subscribing
        // to the result of getGoals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testGoals) a few lines
        // down.
        goalService.getGoals().subscribe(
            goals => expect(goals).toBe(testGoals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(goalService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testGoals);
    });

    it('getGoals(goalCategory) adds appropriate param string to called URL', () => {
        goalService.getGoals('o').subscribe(
            goals => expect(goals).toEqual(mGoals)
        );

        const req = httpTestingController.expectOne(goalService.baseUrl + '?category=o&');
        expect(req.request.method).toEqual('GET');
        req.flush(mGoals);
    });

    it('filterByCategory(goalCategory) deals appropriately with a URL that already had a category', () => {
        currentlyImpossibleToGenerateSearchGoalUrl = goalService.baseUrl + '?category=f&something=k&';
        goalService['goalUrl'] = currentlyImpossibleToGenerateSearchGoalUrl;
        goalService.filterByCategory('o');
        expect(goalService['goalUrl']).toEqual(goalService.baseUrl + '?something=k&category=o&');
    });

    it('filterByCategory()terByCategory()) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchGoalUrl = goalService.baseUrl + '?something=k&';
        goalService['goalUrl'] = currentlyImpossibleToGenerateSearchGoalUrl;
        goalService.filterByCategory('m');
        expect(goalService['goalUrl']).toEqual(goalService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory()terByCategory()) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchGoalUrl = goalService.baseUrl + '?category=&';
        goalService['goalUrl'] = currentlyImpossibleToGenerateSearchGoalUrl;
        goalService.filterByCategory('');
        expect(goalService['goalUrl']).toEqual(goalService.baseUrl + '');
    });

    it('getGoalById() calls api/goals/id', () => {
        const targetGoal: Goal = testGoals[1];
        const targetId: string = targetGoal._id;
        goalService.getGoalByID(targetId).subscribe(
            goal => expect(goal).toBe(targetGoal)
        );

        const expectedUrl: string = goalService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetGoal);
    });

    it('adding a goal calls api/goals/new', () => {
        const jesse_id = { '$oid': 'jesse_id' };
        const newGoal: Goal = {
            _id: 'jesse_id',
            goal: 'To have a safer driveway.',
            category: 'Chores',
            name: 'Shovel driveway',
        };

        goalService.addNewGoal(newGoal).subscribe(
            id => {
                expect(id).toBe(jesse_id);
            }
        );

        const expectedUrl: string = goalService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(jesse_id);
    });
});
