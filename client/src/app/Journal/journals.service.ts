import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Journal} from './journal';
import {environment} from '../../environments/environment';


@Injectable()
export class JournalsService {
    readonly baseUrl: string = environment.API_URL + 'journals';
    private journalUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getJournals(journalCategory?: string): Observable<Journal[]> {
        this.filterByCategory(journalCategory);
        return this.http.get<Journal[]>(this.journalUrl);
    }

    // This isn't used, but may be useful for future iterations.
    getJournalByID(id: string): Observable<Journal> {
        return this.http.get<Journal>(this.journalUrl + '/' + id);
    }

    // Unfortunately we did not get to implementing specific filters,
    // but this may useful in the future.
    filterByCategory(journalCategory?: string): void {
        if (!(journalCategory == null || journalCategory === '')) {
            if (this.parameterPresent('category=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('category=');
            }
            if (this.journalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.journalUrl += 'category=' + journalCategory + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.journalUrl += '?category=' + journalCategory + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('category=')) {
                let start = this.journalUrl.indexOf('category=');
                const end = this.journalUrl.indexOf('&', start);
                if (this.journalUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.journalUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.journalUrl.indexOf(searchParam);
        let end = 0;
        if (this.journalUrl.indexOf('&') !== -1) {
            end = this.journalUrl.indexOf('&', start) + 1;
        } else {
            end = this.journalUrl.indexOf('&', start);
        }
        this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end);
    }

    addNewJournal(newJournal: Journal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/new', newJournal, httpOptions);
    }
}

