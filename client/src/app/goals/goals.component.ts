import {Component, OnInit} from '@angular/core';
import {GoalsService} from './goals.service';
import {Goal} from './goal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddGoalComponent} from './add-goal.component';
import {EditGoalComponent} from "./edit-goal.component";

@Component({
    selector: 'app-goals-component',
    templateUrl: 'goals.component.html',
    styleUrls: ['./goals.component.css'],
})

export class GoalsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public goals: Goal[];
    public filteredGoals: Goal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public goalGoal: string;
    public goalCategory: string;
    public goalName: string;

    // The ID of the goal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the GoalsService into this component.
    constructor(public goalService: GoalsService, public dialog: MatDialog) {

    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newGoal: Goal = {_id: '', goal:'', category:'', name:''};
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '500px',
            data: { goal : newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalService.addNewGoal(result).subscribe(
                addGoalResult => {
                    this.highlightedID = addGoalResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    openDialogEdit(_id: string, goal: string, category: string, name: string): void {
        const newGoal: Goal = {_id: _id, goal: name, category: category, name: goal};
        const dialogRef = this.dialog.open(EditGoalComponent, {
            width: '500px',
            data: { goal : newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalService.editGoal(result).subscribe(
                editGoalResult => {
                    //this.highlightedID = editGoalResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    public filterGoals(searchGoal: string, searchCategory: string, searchName: string): Goal[] {

        this.filteredGoals = this.goals;

        // Filter by goal
        if (searchGoal != null) {
            searchGoal = searchGoal.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchGoal || goal.goal.toLowerCase().indexOf(searchGoal) !== -1;
            });
        }

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchCategory || goal.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchName || goal.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        return this.filteredGoals;
    }

    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshGoals(): Observable<Goal[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const goalObservable: Observable<Goal[]> = this.goalService.getGoals();
        goalObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalGoal, this.goalCategory, this.goalName);
            },
            err => {
                console.log(err);
            });
        return goalObservable;
    }


    loadService(): void {
        this.goalService.getGoals(this.goalCategory).subscribe(
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
