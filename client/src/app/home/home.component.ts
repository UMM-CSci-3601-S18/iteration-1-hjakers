import {Component} from '@angular/core';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    public text: string;

    constructor() {
        this.text = 'Mongo lab';
    }
}
