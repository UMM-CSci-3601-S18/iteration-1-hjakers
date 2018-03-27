import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from './goal';

@Component({
    selector: 'app-edit-goal.component',
    templateUrl: 'edit-goal.component.html',
    styleUrls: ['./manage-goal.component.css'],
})
export class EditGoalComponent {
    constructor(
        public dialogRef: MatDialogRef<EditGoalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
