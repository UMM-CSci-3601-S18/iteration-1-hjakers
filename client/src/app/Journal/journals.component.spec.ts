/*import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Journal} from "./journal";
import {JournalsComponent} from "./journals.component";
import {JournalsService} from "./journal";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {JournalsComponent} from "./journals.component";

describe('Journal ', () => {

    let Journal: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;

    let JournalServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalService for test purposes
        JournalServiceStub = {
            getJournals: () => Observable.of([
                {
                    _id: '1',
                    title: 'Work',
                    body: 'told boss about...',
                    link: '',
                },
                {
                    _id: '2',
                    title: 'Home',
                    body: 'better',
                    link: '',
                },
                {
                    _id: '3',
                    title: 'Driving',
                    body: 'Bad',
                    link: '',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [JournalsComponent],
            providers: [{provide: JournalsService, useValue: JournalServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            Journal = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the Journals', () => {
        expect(Journal.Journals.length).toBe(3);
    });

    it('contains a Journal id \'1\'', () => {
        expect(Journal.Journa
ls.some((Journal: Journal) => Journal._id === '1')).toBe(true);
    });

    it('contain a Journal id \'2\'', () => {
        expect(Journal.Journals.some((Journal: Journal) => Journal._id === '2')).toBe(true);
    });

    it('doesn\'t contain a Journal id \'4\'', () => {
        expect(Journal.Journals.some((Journal: Journal) => Journal._id === '4')).toBe(false);
    });

    it('has a category Chores', () => {
        expect(Journal.Journals.filter((Journal: Journal) => Journal.category === 'Chores').length).toBe(2);
    });

    it('Journal filters by name', () => {
        expect(Journal.filteredJournals.length).toBe(3);
        Journal.JournalName = 'o';
        Journal.refreshJournals().subscribe(() => {
            expect(Journal.filteredJournals.length).toBe(2);
        });
    });

    it('Journal  filters by chores', () => {
        expect(Journal.filteredJournals.length).toBe(3);
        Journal.JournalCategory = 'Chores';
        Journal.refreshJournals().subscribe(() => {
            expect(Journal.filteredJournals.length).toBe(2);
        });
    });

    it('Journal  filters by name and category', () => {
        expect(Journal.filteredJournals.length).toBe(3);
        Journal.JournalCategory = 'Workout';
        Journal.JournalName = 'y';
        Journal.refreshJournals().subscribe(() => {
            expect(Journal.filteredJournals.length).toBe(1);
        });
    });

});

describe('Misbehaving Journal ', () => {
    let Journal: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;

    let JournalServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalService for test purposes
        JournalServiceStub = {
            getJournals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalsComponent],
            providers: [{provide: JournalsService, useValue: JournalServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            Journal = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalService', () => {
        // Since the observer throws an error, we don't expect Journals to be defined.
        expect(Journal.Journals).toBeUndefined();
    });
});


describe('Adding a Journal', () => {
    let Journal: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;
    const newJournal: Journal = {
        _id: '5',
        Journal: 'Get more sleep.',
        category: 'Personal health',
        name: 'Go to bed early',
    };
    const newId = '5';

    let calledJournal: Journal;

    let JournalServiceStub: {
        getJournals: () => Observable<Journal[]>,
        addNewJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddJournalComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalService for test purposes
        JournalServiceStub = {
            getJournals: () => Observable.of([]),
            addNewJournal: (JournalToAdd: Journal) => {
                calledJournal = JournalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalsComponent],
            providers: [
                {provide: JournalsService, useValue: JournalServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            Journal = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalService.addJournal', () => {
        expect(calledJournal).toBeNull();
        Journal.openDialog();
        expect(calledJournal).toEqual(newJournal);
    });
});

*/
