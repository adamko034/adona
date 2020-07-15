import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

interface Data {
  team: Team;
  dateFormat: DateFormat.DayMonthYear;
  requestStatus: ApiRequestStatus;
}

@Component({
  selector: 'app-settings-team',
  templateUrl: './settings-team.component.html',
  styleUrls: ['./settings-team.component.scss']
})
export class SettingsTeamComponent implements OnInit {
  public data$: Observable<Data>;
  public teamNameFormControl = new FormControl('', [CustomValidators.requiredValue]);

  public isMembersEditMode = false;

  constructor(
    private teamsFacade: TeamsFacade,
    private routerFacade: RouterFacade,
    private apiRequestFacade: ApiRequestsFacade
  ) {}

  public ngOnInit(): void {
    this.data$ = combineLatest([this.getTeam(), this.apiRequestFacade.selectApiRequest(apiRequestIds.loadTeam)]).pipe(
      map(([team, request]) => {
        return { team, dateFormat: DateFormat.DayMonthYear, requestStatus: request };
      })
    );
  }

  private getTeam(): Observable<Team> {
    return this.routerFacade.selectRouteParams().pipe(
      switchMap((params) => this.teamsFacade.selectTeam(params.id)),
      tap((team) => this.teamNameFormControl.setValue(team?.name))
    );
  }
}
