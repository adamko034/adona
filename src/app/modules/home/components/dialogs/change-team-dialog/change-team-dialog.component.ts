import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserTeam } from 'src/app/core/user/model/team-in-user.model';
import { User } from 'src/app/core/user/model/user.model';

@Component({
  selector: 'app-change-team-dialog',
  templateUrl: './change-team-dialog.component.html',
  styleUrls: ['./change-team-dialog.component.scss']
})
export class ChangeTeamDialogComponent implements OnInit {
  public currentTeamId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<ChangeTeamDialogComponent>
  ) {}

  public ngOnInit() {
    this.currentTeamId = this.data.user.selectedTeamId;
  }

  public getRecentTeams(): UserTeam[] {
    return [...this.data.user.teams]
      .filter((team: UserTeam) => team.id !== this.data.user.selectedTeamId)
      .sort((t1, t2) => +t2.updated - +t1.updated)
      .slice(0, 3);
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
