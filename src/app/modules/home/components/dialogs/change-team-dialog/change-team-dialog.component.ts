import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { sortBy } from 'lodash';
import { UserTeam } from 'src/app/core/user/model/user-team.model';
import { User } from 'src/app/core/user/model/user.model';

@Component({
  selector: 'app-change-team-dialog',
  templateUrl: './change-team-dialog.component.html',
  styleUrls: ['./change-team-dialog.component.scss']
})
export class ChangeTeamDialogComponent implements OnInit {
  public currentTeamId: string;
  public recentTeams: UserTeam[];
  public sortedTeams: UserTeam[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<ChangeTeamDialogComponent>
  ) {}

  public ngOnInit() {
    this.currentTeamId = this.data.user.selectedTeamId;
    this.sortedTeams = sortBy([...this.data.user.teams], 'name');
    this.recentTeams = this.getRecentTeams();
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

  private getRecentTeams(): UserTeam[] {
    return [...this.data.user.teams]
      .filter((team: UserTeam) => team.id !== this.data.user.selectedTeamId)
      .sort((t1, t2) => +t2.updated - +t1.updated)
      .slice(0, 3);
  }
}
