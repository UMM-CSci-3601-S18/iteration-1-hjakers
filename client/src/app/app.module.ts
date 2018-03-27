import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';
import {CustomModule} from './custom.module';

import {ResourcesComponent} from "./resources/resources.component";

import {EmotionService} from "./home/home.service";

import {GoalsComponent} from "./goals/goals.component";
import {GoalsService} from "./goals/goals.service";
import {EditGoalComponent} from "./goals/edit-goal.component";
import {AddGoalComponent} from "./goals/add-goal.component";

import {SummaryListComponent} from "./summary/summary-list.component";
import {SummaryListService} from "./summary/summary-list.service";



@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ResourcesComponent,
        GoalsComponent,
        AddGoalComponent,
        EditGoalComponent,
        SummaryListComponent,

    ],
    providers: [
        GoalsService,
        EmotionService,
        SummaryListService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
        AddGoalComponent,
        EditGoalComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
