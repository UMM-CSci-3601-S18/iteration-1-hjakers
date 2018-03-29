import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Friendly Panda App';

    appHeight: number;
    appWidth: number;

    currentScreenWidth: number;


    constructor() {
        this.appHeight = (window.screen.height);
        this.appWidth = (window.screen.width);
        this.currentScreenWidth = (window.screen.width);

    }


    onResize (event) {
        this.currentScreenWidth = event.target.innerWidth;
    }


}
