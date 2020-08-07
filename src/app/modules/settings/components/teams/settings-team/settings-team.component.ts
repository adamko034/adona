import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
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
export class SettingsTeamComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;
  private user: User;

  public data: Data;
  public teamNameFormControl = new FormControl('', [CustomValidators.requiredValue]);

  public isMembersEditMode = false;

  constructor(
    private userFacade: UserFacade,
    private teamsFacade: TeamsFacade,
    private routerFacade: RouterFacade,
    private apiRequestFacade: ApiRequestsFacade,
    private dialogService: DialogService,
    private unsubscriber: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriber.create();
  }

  public ngOnInit(): void {
    combineLatest([
      this.userFacade.selectUser(),
      this.getTeam(),
      this.apiRequestFacade.selectApiRequest(apiRequestIds.loadTeam)
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([user, team, requestStatus]) => {
        this.user = user;
        this.data = { dateFormat: DateFormat.DayMonthYear, team, requestStatus };
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
  }

  public isPersonalTeam(): boolean {
    return this.data.team.id === this.user.personalTeamId;
  }

  public onDeleteTeam(): void {
    const dialogProps: DialogProperties<TeamRemoveDialogData> = { data: { teamName: this.data.team.name } };

    this.dialogService
      .open<TeamRemoveDialogData>(TeamRemoveDialogComponent, dialogProps)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dialogResult: DialogResult<undefined>) => {
        if (dialogResult.action === DialogAction.Confirm) {
          this.teamsFacade.deleteTeam(this.data.team.id);
        }
      });
  }

  private getTeam(): Observable<Team> {
    return this.routerFacade.selectRouteParams().pipe(
      switchMap((params) => this.teamsFacade.selectTeam(params.id)),
      tap((team) => this.teamNameFormControl.setValue(team?.name))
    );
  }
}
