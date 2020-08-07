import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamRemoveDialogData } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/model/team-remove-dialog-data.model';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-team-remove-dialog',
  templateUrl: './team-remove-dialog.component.html',
  styleUrls: ['./team-remove-dialog.component.scss']
})
export class TeamRemoveDialogComponent {
  public teamNameFormControl = new FormControl('', [CustomValidators.requiredValue]);
  public teamName: string;
  public teamNameConfirmed = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TeamRemoveDialogData,
    private dialogRef: MatDialogRef<TeamRemoveDialogComponent>
  ) {
    this.teamName = this.data.teamName;
  }

  public onTeamNameChange(value: string): void {
    this.teamNameConfirmed = value === this.teamName;
  }

  public onTeamNameBlur(): void {
    const error = this.teamNameConfirmed ? null : { notEqual: true };
    this.teamNameFormControl.setErrors(error);
  }

  public confirm(): void {
    const result: DialogResult<null> = { action: DialogAction.Confirm };
    this.dialogRef.close(result);
  }

  public cancel(): void {
    const result: DialogResult<null> = { action: DialogAction.Cancel };
    this.dialogRef.close(result);
  }
}
