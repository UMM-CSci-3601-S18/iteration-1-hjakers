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
import {GoalsComponent} from "./goals/goals.component";
import {AddGoalComponent} from "./goals/add-goal.component";
import {GoalsService} from "./goals/goals.service";

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
    ],
    providers: [
        GoalsService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
      AddGoalComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
