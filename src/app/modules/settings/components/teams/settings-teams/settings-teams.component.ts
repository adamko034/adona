import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { TeamRemoveDialogData } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/model/team-remove-dialog-data.model';
import { TeamRemoveDialogComponent } from 'src/app/modules/settings/components/dialogs/team-remove-dialog/team-remove-dialog.component';
import { DialogAction } from 'src/app/shared/enum/dialog-action.enum';
import { DialogProperties } from 'src/app/shared/services/dialogs/dialog-properties.model';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { DialogService } from 'src/app/shared/services/dialogs/dialog.service';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';

interface SettingsTeam {
  id: string;
  name: string;
  createdBy?: string;
  created?: Date;
}

interface Data {
  teams: SettingsTeam[];
  requestStatus: ApiRequestStatus;
  dateFormat: DateFormat;
}

@Component({
  selector: 'app-settings-teams',
  templateUrl: './settings-teams.component.html',
  styleUrls: ['./settings-teams.component.scss']
})
export class SettingsTeamsComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;
  private user: User;

  public data: Data;

  constructor(
    private userFacade: UserFacade,
    private teamsFacade: TeamsFacade,
    private unsubscriber: UnsubscriberService,
    private apiRequestsFacade: ApiRequestsFacade,
    private dialogService: DialogService
  ) {
    this.destroyed$ = this.unsubscriber.create();
  }

  public ngOnInit(): void {
    combineLatest([
      this.userFacade.selectUser(),
      this.apiRequestsFacade.selectApiRequest(apiRequestIds.loadTeams),
      this.teamsFacade.selectTeams()
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([user, loadTeamsRequest, teams]) => {
        this.user = user;
        const settingsTeams = this.mergeUserTeamsAndTeams(user.teams, teams);
        this.data = { dateFormat: DateFormat.DayMonthYear, requestStatus: loadTeamsRequest, teams: settingsTeams };
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
  }

  public isPersonalTeam(teamId: string): boolean {
    return teamId === this.user.personalTeamId;
  }

  public onTeamRemove(team: Team): void {
    const props: DialogProperties<TeamRemoveDialogData> = { data: { teamName: team.name } };
    this.dialogService
      .open<TeamRemoveDialogData>(TeamRemoveDialogComponent, props)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result: DialogResult<null>) => {
        if (result.action === DialogAction.Confirm) {
          this.teamsFacade.deleteTeam(team.id);
        }
      });
  }

  private mergeUserTeamsAndTeams(userTeams: UserTeam[], teams: Team[]): SettingsTeam[] {
    const settingsTeams: SettingsTeam[] = [];

    if (userTeams) {
      userTeams.forEach(({ id, name }) => settingsTeams.push({ id, name }));
    }

    if (teams) {
      teams.forEach((team) => {
        const existing = settingsTeams.find((s) => s.id === team.id);

        if (existing) {
          existing.created = team.created;
          existing.createdBy = team.createdBy;
        } else {
          const newTeam: SettingsTeam = {
            id: team.id,
            name: team.name,
            created: team.created,
            createdBy: team.createdBy
          };
          settingsTeams.push(newTeam);
        }
      });
    }

    return settingsTeams;
  }
}
