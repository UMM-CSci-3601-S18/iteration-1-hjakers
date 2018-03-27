import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Goal} from './goal';
import {environment} from '../../environments/environment';


@Injectable()
export class GoalsService {
    readonly baseUrl: string = environment.API_URL + 'goals';
    private goalUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getGoals(goalCategory?: string): Observable<Goal[]> {
        this.filterByCategory(goalCategory);
        return this.http.get<Goal[]>(this.goalUrl);
    }

    // This isn't used, but may be useful for future iterations.
    getGoalByID(id: string): Observable<Goal> {
        return this.http.get<Goal>(this.goalUrl + '/' + id);
    }

    // Unfortunately we did not get to implementing specific filters,
    // but this may useful in the future.
    filterByCategory(goalCategory?: string): void {
        if (!(goalCategory == null || goalCategory === '')) {
            if (this.parameterPresent('category=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('category=');
            }
            if (this.goalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.goalUrl += 'category=' + goalCategory + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.goalUrl += '?category=' + goalCategory + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('category=')) {
                let start = this.goalUrl.indexOf('category=');
                const end = this.goalUrl.indexOf('&', start);
                if (this.goalUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.goalUrl = this.goalUrl.substring(0, start) + this.goalUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.goalUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.goalUrl.indexOf(searchParam);
        let end = 0;
        if (this.goalUrl.indexOf('&') !== -1) {
            end = this.goalUrl.indexOf('&', start) + 1;
        } else {
            end = this.goalUrl.indexOf('&', start);
        }
        this.goalUrl = this.goalUrl.substring(0, start) + this.goalUrl.substring(end);
    }

    addNewGoal(newGoal: Goal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new goal with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalUrl + '/new', newGoal, httpOptions);
    }

    editGoal(id: string): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new goal with the user data as the body with specified headers.
        console.log(id);
        return this.http.post<{'$oid': string}>(this.goalUrl + '/edit', id, httpOptions);
    }
}
