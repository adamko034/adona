import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';

interface Data {
  teams: Team[];
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
    private teamsFacade: TeamsFacade,
    private unsubscriber: UnsubscriberService,
    private apiRequestsFacade: ApiRequestsFacade
  ) {
    this.destroyed$ = this.unsubscriber.create();
  }

  public ngOnInit(): void {
    combineLatest([this.teamsFacade.selectTeams(), this.apiRequestsFacade.selectApiRequest(apiRequestIds.loadTeams)])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([teams, apiRequest]) => {
        this.data = { dateFormat: DateFormat.DayMonthYear, teams, requestStatus: apiRequest };
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
  }
}
