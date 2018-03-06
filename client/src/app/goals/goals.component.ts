import {Component, OnInit} from '@angular/core';
import {GoalsService} from "./goals.service";
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {Goal} from './goal'
import {AddGoalComponent} from "./add-goal.component";

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
        this.user_id = 2;
    }

    public goals: Goal[];
    public filteredGoals: Goal[];

    public goalGoal: string;
    public goalTimeCreated: number;
    public goalComplete: boolean;
    public user_id: number;

    private highlightedID: {'$oid': string} = { '$oid': '' };

    openDialog(): void {
        const newGoal: Goal = {_id: '', user_id:this.user_id, goal:'', timeCreated:-1, complete:false};
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '500px',
            data: { goal : newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalService.addNewGoal(result).subscribe(
                addUserResult => {
                    this.highlightedID = addUserResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    refreshGoals(): Observable<Goal[]> {
        const goalObservable: Observable<Goal[]> = this.goalService.getGoals();
        goalObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalGoal, this.goalTimeCreated, this.goalComplete);
            },
            err => {
                console.log(err);
            });
        return goalObservable;
    }

    public filterGoals(searchGoal: string, searchTime: number, searchComplete: boolean) {
        this.filteredGoals = this.goals;

        if(searchGoal != null) {
            searchGoal = searchGoal.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchGoal || goal.goal.toLowerCase().indexOf(searchGoal) !== -1;
            });
        }

        if(searchTime != null) {
            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchTime || goal.timeCreated == searchTime;
            });
        }

        if(searchComplete != null) {
            this.filteredGoals = this.filteredGoals.filter(goal => {
                return null || goal.complete == searchComplete;
            });
        }

        return this.filteredGoals;

    }

    loadService(): void {
        this.goalService.getGoals(this.user_id).subscribe(
            goals => {
                this.goals = goals;
                this.filteredGoals = this.goals;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        this.refreshGoals();
        this.loadService();
    }
}
