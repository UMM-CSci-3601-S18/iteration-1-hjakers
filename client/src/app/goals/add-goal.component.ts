import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from './goal';
import {Observable} from "rxjs/Observable";
import {GoalsService} from "./goals.service";

@Component({
    selector: 'app-add-goal.component',
    templateUrl: 'add-goal.component.html',
})
export class AddGoalComponent {
    constructor(private goalsService: GoalsService,
        public dialogRef: MatDialogRef<AddGoalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
