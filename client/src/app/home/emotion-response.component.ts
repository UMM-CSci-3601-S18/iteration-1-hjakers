import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Resource} from './resource';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Component({
    selector: 'emotion-response-component',
    templateUrl: 'emotion-response.component.html',
    styleUrls: ['emotion-response.component.css'],
})

export class EmotionResponseComponent {
    giveResponse : boolean = false;
    selectedResponse : SafeResourceUrl;
    resourceUrl : string = environment.API_URL + 'resources';


    constructor(public dialogRef: MatDialogRef<EmotionResponseComponent>,
                private http: HttpClient,
                private sanitizer: DomSanitizer) {
    }


    onYesClick(): void{
        var linkObservable: Observable<Resource[]> = this.getLinks();
        linkObservable.subscribe(
            links => {
                console.log("successfully retrieved resource links from the database");
                var index = Math.floor(Math.random() * links.length);
                this.selectedResponse = this.sanitizer.bypassSecurityTrustResourceUrl(links[index].resource);

                console.log("this was chosen: " + this.selectedResponse);

                if(this.selectedResponse != ""){
                    this.giveResponse=true;
                }

            },
            err => {
                console.log(err);
            });

    }

    getLinks(): Observable<Resource[]> {
        return this.http.get<Resource[]>(this.resourceUrl);
    }

    onExitClick(): void {
        this.dialogRef.close();
    }

}
