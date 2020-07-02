import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';
import { User } from 'src/app/core/user/model/user/user.model';

@Component({
  selector: 'app-change-team-dialog',
  templateUrl: './change-team-dialog.component.html',
  styleUrls: ['./change-team-dialog.component.scss']
})
export class ChangeTeamDialogComponent implements OnInit {
  public currentTeamId: string;
  public teams: UserTeam[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<ChangeTeamDialogComponent>
  ) {}

  public ngOnInit() {
    this.currentTeamId = this.data.user.selectedTeamId;
    this.teams = this.data.user.teams.filter((t) => t.id !== this.currentTeamId);
  }

  public onTeamSelected(teamId: string) {
    this.dialogRef.close({ payload: teamId });
  }

  public isTeamCurrentlySelected(teamId: string): boolean {
    return this.data.user.selectedTeamId === teamId;
  }

  public close() {
    this.dialogRef.close(null);
  }
}
