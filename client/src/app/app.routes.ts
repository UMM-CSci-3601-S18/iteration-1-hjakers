// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ResourcesComponent} from "./resources/resources.component";
import {GoalsComponent} from "./goals/goals.component";
import {MatSliderModule} from '@angular/material/slider';
import {SummaryListComponent} from "./summary/summary-list.component";
// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'resources', component: ResourcesComponent},
    {path: 'goals', component: GoalsComponent},
    {path: 'summary', component: SummaryListComponent},
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
