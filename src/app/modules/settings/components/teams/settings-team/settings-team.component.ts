import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

interface Data {
  team: Team;
  dateFormat: DateFormat.DayMonthYear;
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

  constructor(private teamsFacade: TeamsFacade, private routerFacade: RouterFacade) {}

  public ngOnInit(): void {
    this.data$ = this.routerFacade.selectRouteParams().pipe(
      switchMap((params) => this.teamsFacade.selectTeam(params.id)),
      tap((team: Team) => this.teamNameFormControl.setValue(team?.name)),
      map((team: Team) => ({ team, dateFormat: DateFormat.DayMonthYear }))
    );
  }
}
