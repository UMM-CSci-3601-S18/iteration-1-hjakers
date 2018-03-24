import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Component({
    selector: 'app-emotion-response.component',
    templateUrl: 'edit-emotion-response.html',
})

export class EmotionResponseComponent {
    giveResponse : boolean = false;
    selectedResponse : string = "";
    resourceUrl : string = environment.API_URL + 'resources';


    constructor(public dialogRef: MatDialogRef<EmotionResponseComponent>, private http: HttpClient) {
    }


    onYesClick(): void{
        const linkObservable: Observable<string[]> = this.getLinks();
        linkObservable.subscribe(
            links => {
                var index = Math.floor(Math.random() * links.length);
                //this.selectedResponse = links[index];
                this.selectedResponse = "www.google.com";
                if(this.selectedResponse != ""){
                    this.giveResponse=true;
                }

            },
            err => {
                console.log(err);
            });
    }

    getLinks(): Observable<string[]> {
        return this.http.get<string[]>(this.resourceUrl);
    }

    onExitClick(): void {
        this.dialogRef.close();
    }
}