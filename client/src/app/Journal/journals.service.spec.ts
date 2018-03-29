import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Journal} from './journal';
import {JournalsService} from './journals.service';

describe('Journal service: ', () => {
    // A small collection of test journals
    const testJournals: Journal[] = [
        {
            _id: '1',
            title: 'Mental health and mental disorder in the European Journal of Public Health',

            body: 'ental Health and mental disorder including suicide and suicidal behavior have been a neglected issue in Public Health for many years. Yet, mental disorders rank among the disorders which contribute enormous suffering for affected persons and their families, high burden of disability adjusted life years (DALYS), and high economic and societal direct and indirect costs. People with severe mental illness have increased risk for premature mortality and thus a shorter life expectancy (Ösby U).\n' +
            '\n' +
            'The fact that mental disorders are the leading causes of the burden of disease make research in mental disorders and policies to promote mental health a Public Health priority, worldwide. More knowledge on the scope and extent of mental health and mental disorders, the relationship between mental health and mental disorder and the determinants of mental health and mental disorder is highly needed.  As examples of determinants a variety of determinants of mental disorders (e.g., economic, social factors, relationship factors, factors related to the physical environment) have been identified. Economic factors such as relative deprivation (Gunnarsdóttir H), social factors such as social adversities (Rajaleid K) and working related factors, relationship factors such as violence and victimization, and factors related to the physical environment have been identified.\n' +
            '\n' +
            'Social adversities over the life course have not only short term but also long-term effects on mental health and social adversities in adolescence predict trajectories of internalized mental ill-health symptoms. Working related factors related to mental disorders are employment status (Katikireddi S), working conditions (Kouvonen A), and employment history (von Bonsdorff MB). In the study from the Netherlands by von Bonsdorf discontinuous employment during mid-career was associated with poorer self-reported physical and mental functioning around the age of retirement. Herewith the long term effects of exposures to social adversities such as financial stress and interrupted employment histories were highlighted. Many studies have investigated how unemployment history influences health, less attention has been paid to the reverse causal direction; how health may influence the risk of employment history and the risk of becoming unemployed. However, an interrupted employment history might be both an indicator for mental disorders and a determinant of mental disorders as people with poor mental and physical health are at increased risk of job loss. (Kaspersen SL)',
            date:  '',

        },
        {
            _id: '2',
            title: '\n' +
            'Analysis of quantitative and qualitative measures of attachment in patients with fibromyalgia: The influence on nursing care',

            body: 'Attachment has been associated to fibromyalgia; however, this relationship has not been studied from the perspective of nursing care. In this study, in which 146 women with fibromyalgia participated, higher scores for anxiety and depression were found among those with fearful attachment. Additionally, attachment, as a quantitative measure, has also been associated to the functional limitation of the patients. Therefore, we propose the inclusion of attachment in the care of patients with fibromyalgia.\n' +
            '\n',
            date: '',

        },
        {
            _id:'3',
            title: 'International Journal of Emergency Mental Health and Human Resilience',
            body: 'Mental Depression\n',
           date: ''
        }
    ];
    const mJournals: Journal[] = testJournals.filter(journal =>
        journal.title.toLowerCase().indexOf('o') !== 2
    );

    // We will need some url information from the journalService to meaningfully test category filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let journalService: JournalsService;
    let currentlyImpossibleToGenerateSearchJournalUrl: string;

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
        journalService = new JournalsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getJournals() calls api/journals', () => {
        // Assert that the journals we get from this call to getJournals()
        // should be our set of test journals. Because we're subscribing
        // to the result of getJournals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testJournals) a few lines
        // down.
        journalService.getJournals().subscribe(
            journals => expect(journals).toBe(testJournals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(journalService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testJournals);
    });

    it('getJournals(journalCategory) adds appropriate param string to called URL', () => {
        journalService.getJournals('o').subscribe(
            journals => expect(journals).toEqual(mJournals)
        );

        const req = httpTestingController.expectOne(journalService.baseUrl + '?category=o&');
        expect(req.request.method).toEqual('GET');
        req.flush(mJournals);
    });

    it('filterByCategory(journalCategory) deals appropriately with a URL that already had a category', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalService.baseUrl + '?category=f&something=k&';
        journalService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalService.filterByCategory('o');
        expect(journalService['journalUrl']).toEqual(journalService.baseUrl + '?something=k&category=o&');
    });

    it('filterByCategory()terByCategory()) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalService.baseUrl + '?something=k&';
        journalService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalService.filterByCategory('m');
        expect(journalService['journalUrl']).toEqual(journalService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory()terByCategory()) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalService.baseUrl + '?category=&';
        journalService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalService.filterByCategory('');
        expect(journalService['journalUrl']).toEqual(journalService.baseUrl + '');
    });

    it('getJournalById() calls api/journals/id', () => {
        const targetJournal: Journal = testJournals[1];
        const targetId: string = targetJournal._id;
        journalService.getJournalByID(targetId).subscribe(
            journal => expect(journal).toBe(targetJournal)
        );

        const expectedUrl: string = journalService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetJournal);
    });

    it('adding a journal calls api/journals/new', () => {
        const jesse_id = { '$oid': 'jesse_id' };
        const newJournal: Journal = {
            _id: '4',
            title: 'Mental health service user and staff perspectives on tobacco addiction and smoking cessation: A meta‐synthesis of published qualitative studies',
            body: 'People with mental illness are up to 3 dates more likely to smoke and experience greater challenges and less success when trying to quit, therefore have higher risk of smoking‐related morbidity and mortality. There is a lack of evidence on successful interventions to reduce the smoking rates in people living with serve mental illness. A meta‐synthesis was undertaken to summarise data from multiple studies to inform the development of future smoking cessation intervention studies.',
            date: '',

        };

        journalService.addNewJournal(newJournal).subscribe(
            id => {
                expect(id).toBe(jesse_id);
            }
        );

        const expectedUrl: string = journalService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(jesse_id);
    });
});

