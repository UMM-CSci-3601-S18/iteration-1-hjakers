import {EmotionResponseComponent} from "./emotion-response.component";
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EmotionService} from './home.service';
import {MAT_DIALOG_DATA} from '@angular/material';

import {Observable} from 'rxjs/Observable';

import {Emotion} from './emotion';
import {environment} from '../../environments/environment';


@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public emotions: Emotion[];

    readonly baseUrl: string = environment.API_URL + 'emotions';
    private emotionUrl: string = this.baseUrl;

    private highlightedID: {'$oid': string} = { '$oid': '' };

    public title: string;
    private selectedEmotion = "none";
    private selectedEmoji = "happy";

    public emotionMood: string;
    public emotionIntensity: number;
    public emotionDescription: string;
    public emotionDate: string;


    //used for slider
    thumbLabel = true;
    public emojiRating: number = 0;

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public emotionService: EmotionService) {
        this.title = 'Home';
    }

    emotion(){
        if(this.selectedEmotion == "none"){
            return "..";
        }

        return this.selectedEmotion;
    }

    setEmotion(emotion){
        this.selectedEmotion = emotion;
    }

    selectEmotion(ID){
        var clickedSize = "12%";
        this.resetSelections();
        this.selectedEmoji = ID;
        {document.getElementById(ID).style.height = clickedSize}
        {document.getElementById(ID).style.width = clickedSize}
    }

    private resetSelections(){
        var baseSize = "10%";

        {document.getElementById(this.selectedEmoji).style.height = baseSize}
        {document.getElementById(this.selectedEmoji).style.width = baseSize}

    }

    showTextBox(): boolean{
        if(this.selectedEmotion == "none"){
            return false;
        }

        return true;
    }result

    showSaveButton(){
        if(this.selectedEmotion == "none"){
            return true;
        }

        return false;
    }

    resetPage(){
        this.resetSelections();
        this.selectedEmotion = "none";
        this.emojiRating = 0;
        this.emotionDescription = "";

    }

    saveEmotion(): void{
        const newEmotion: Emotion = {_id: '', mood: this.selectedEmotion, intensity: this.emojiRating, description:this.emotionDescription, date: this.emotionDate};

            console.log("this is the description: " + this.emotionDescription);
            console.log(newEmotion);
            this.emotionService.addNewEmotion(newEmotion).subscribe(
                addEmotionResult => {
                    console.log("I got here");
                    this.highlightedID = addEmotionResult;
                    this.refreshEmotions();
                    this.resetPage();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the emotion.');
                    console.log('The error was ' + JSON.stringify(err));
                });
    }

    refreshEmotions(): Observable<Emotion[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const emotionObservable: Observable<Emotion[]> = this.emotionService.getEmotions();
        emotionObservable.subscribe(
            emotions => {
                this.emotions = emotions;
                /*this.filterEmotions(this.emotionMood, this.emotionIntensity, this.emotionDescription, this.emotionDate);*/
            },
            err => {
                console.log(err);
            });
        return emotionObservable;
    }

    getDate(){
        var today = new Date();
        console.log("today is: " + today.toString());
        this.emotionDate = today.toString();
    }

    getDescription(entryBox){
        this.emotionDescription = entryBox;
        console.log("this is the description: " + entryBox);
    }

    //retrieves an appropriate response to an emotion selection
    appropriateResponsePopUp(): void {

        var doPopup: boolean = this.intenseEmotionResponse();
        if(doPopup){
            var dialogRef = this.dialog.open(EmotionResponseComponent, {
                width: '70vw',
                height: '70%',
            });
        }

        this.saveConfirmation();

    }

    //checks the emotional response and the intensity to see if a response is needed
    intenseEmotionResponse(): boolean {

        console.log("the selected emoji is: " + this.selectedEmotion);
        console.log("the emoji rating is:   " + this.emojiRating);
        if(this.selectedEmotion.toLowerCase() == 'sad' || this.selectedEmotion.toLowerCase() == 'mad' || this.selectedEmotion.toLowerCase() == 'scared' || this.selectedEmotion.toLowerCase() == 'anxious'){
            if(this.emojiRating >= 3){
                return true;
            }
        }
        return false;
    }

    saveConfirmation(): void {
        this.snackBar.open("Your response has been saved.", "close", {duration: 2000});
    }
}
