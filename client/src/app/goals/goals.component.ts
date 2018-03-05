import {Component, OnInit} from '@angular/core';
import {GoalsService} from "./goals.service";
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {Goal} from './goal'

@Component({
    selector: 'goals-component',
    templateUrl: 'goals.component.html',
    styleUrls: ['./goals.component.css'],
})
export class GoalsComponent implements OnInit {
    public title: string;

    constructor(public goalService: GoalsService,
                public dialog: MatDialog) {
        this.title = 'Goals';
    }

    public goals: Goal[];
    public filteredGoals: Goal[];

    public goalGoal: string;
    public goalTimeCreated: number;
    public goalComplete: boolean;



    ngOnInit(): void {
        // this.refreshGoals();
        // this.loadService();
    }
}
