import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';
import { UserFacade } from 'src/app/core/user/user.facade';
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

  public data: Data;

  constructor(
    private userFacade: UserFacade,
    private teamsFacade: TeamsFacade,
    private unsubscriber: UnsubscriberService,
    private apiRequestsFacade: ApiRequestsFacade
  ) {
    this.destroyed$ = this.unsubscriber.create();
  }

  public ngOnInit(): void {
    combineLatest([
      this.userFacade.selectUserTeams(),
      this.apiRequestsFacade.selectApiRequest(apiRequestIds.loadTeams),
      this.teamsFacade.selectTeams()
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([userTeams, loadTeamsRequest, teams]) => {
        const settingsTeams = this.mergeUserTeamsAndTeams(userTeams, teams);
        this.data = { dateFormat: DateFormat.DayMonthYear, requestStatus: loadTeamsRequest, teams: settingsTeams };
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
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
