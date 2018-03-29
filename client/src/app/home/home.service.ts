import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Emotion} from './emotion';
import {environment} from '../../environments/environment';


@Injectable()
export class EmotionService {
    readonly baseUrl: string = environment.API_URL + 'emotions';
    private emotionUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    private parameterPresent(searchParam: string) {
        return this.emotionUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.emotionUrl.indexOf(searchParam);
        let end = 0;
        if (this.emotionUrl.indexOf('&') !== -1) {
            end = this.emotionUrl.indexOf('&', start) + 1;
        } else {
            end = this.emotionUrl.indexOf('&', start);
        }
        this.emotionUrl = this.emotionUrl.substring(0, start) + this.emotionUrl.substring(end);
    }

    getEmotions(emotionMood?: string): Observable<Emotion[]> {
        return this.http.get<Emotion[]>(this.emotionUrl);
    }

    addNewEmotion(newEmotion: Emotion): Observable<{'$oid': string}> {
        console.log("here");
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(this.http.post<{'$oid': string}>(this.emotionUrl + '/new', newEmotion, httpOptions));

        // Send post request to add a new emotion with the emotion data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.emotionUrl + '/new', newEmotion, httpOptions);
    }
}
