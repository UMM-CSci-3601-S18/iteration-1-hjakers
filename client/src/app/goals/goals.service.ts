import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {Goal} from "./goal";
import {environment} from '../../environments/environment';

@Injectable()
export class GoalsService {
    readonly baseUrl: string = environment.API_URL + "goals";
    private goalUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {

    }

    getGoals(userId?: number): Observable<Goal[]> {
        this.filterByUserId(userId);
        return this.http.get<Goal[]>(this.goalUrl);
    }

    getGoalById(id: string): Observable<Goal> {
        return this.http.get<Goal>(this.goalUrl + '/' + id);
    }

    filterByUserId(userId?: number): void {
        if(!(userId == null)) {
            if(this.parameterPresent('user_id=')) {
                this.removeParameter('user_id=');
            }
            if (this.goalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.goalUrl += 'user_id=' + userId + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.goalUrl += '?user_id=' + userId + '&';
            }
        }
        else {
            if(this.parameterPresent('user_id=')) {
                let start = this.goalUrl.indexOf('user_id=');
                const end = this.goalUrl.indexOf('&', start);
                if(this.goalUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.goalUrl = this.goalUrl.substring(0, start) + this.goalUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.goalUrl.indexOf(searchParam) !== -1;
    }

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

        // Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalUrl + '/new', newGoal, httpOptions);
    }
}
