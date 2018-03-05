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

    filterByUserId(userId?: number): void {
        if(!(userId == null)) {
            if(this.parameterPresent('userId=')) {
                this.removeParameter('userId=');
            }
            if(!(this.goalUrl.indexOf('?') !== -1)) {
                this.goalUrl += '?';
            }
            this.goalUrl += 'userId=' + userId + '&';
        }
        else {
            if(this.parameterPresent('userId=')) {
                let start = this.goalUrl.indexOf('userId=');
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
}
