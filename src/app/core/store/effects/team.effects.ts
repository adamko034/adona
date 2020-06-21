import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { teamActions } from 'src/app/core/store/actions/team.actions';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamUtilsService } from 'src/app/core/team/services/team-utils.service';
import { TeamService } from 'src/app/core/team/services/team.service';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { UserFacade } from 'src/app/core/user/user.facade';
import { resources } from 'src/app/shared/resources/resources';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions,
    private userFacade: UserFacade,
    private teamService: TeamService,
    private teamFacade: TeamFacade,
    private errorEffectService: ErrorEffectService,
    private guiFacade: GuiFacade,
    private invitationsFacade: InvitationsFacade,
    private resource: ResourceService,
    private teamUtilsService: TeamUtilsService
  ) {}

  public newTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.newTeamRequested),
      tap(() => this.guiFacade.showLoading()),
      concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUserId()))),
      switchMap(([action, uid]) => this.teamService.addTeam(action.request, uid)),
      switchMap((team: Team) => [
        teamActions.newTeamCreateSuccess({ team }),
        userActions.teamAdded({ id: team.id, name: team.name, updated: team.created }),
        userActions.changeTeamSuccess({ teamId: team.id, updated: team.created })
      ]),
      catchError((err) => of(teamActions.newTeamCreateFailure({ error: { errorObj: err } })))
    );
  });

  public newTeamCreateSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.newTeamCreateSuccess),
        concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
        map(([action, user]) => {
          Logger.logDev('Team Effects, New Team Create Success: sending emails and handling gui');
          const team = action.team;
          const recipients = this.teamUtilsService.getMembersEmailsWithout(team, user.email);

          if (recipients.length > 0) {
            const invitationsReqeust = InvitationRequestBuilder.from(
              user.email,
              team.id,
              team.name,
              recipients
            ).build();
            this.invitationsFacade.send(invitationsReqeust);
          }

          const toastrData = ToastrDataBuilder.from(
            this.resource.format(resources.team.created, team.name),
            ToastrMode.SUCCESS
          ).build();

          this.guiFacade.showToastr(toastrData);
          this.guiFacade.hideLoading();

          return action;
        })
      );
    },
    { dispatch: false }
  );

  public newTeamCreateFailure$ = this.errorEffectService.createFrom(this.actions$, teamActions.newTeamCreateFailure);

  public loadTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.loadTeamRequested),
      tap(() => Logger.logDev('team effect, load team requested, starting')),
      concatMap((action) => of(action).pipe(withLatestFrom(this.teamFacade.selectTeams()))),
      filter(([action, teams]) => !teams[action.id]),
      map(([action, teams]) => action.id),
      switchMap((id: string) => {
        Logger.logDev('team effect, load team requsted, calling service');
        return this.teamService.loadTeam(id).pipe(
          tap(() => Logger.logDev('team effect, load team requsted, got team')),
          map((team: Team) => teamActions.loadTeamSuccess({ team })),
          catchError((err) => of(teamActions.loadTeamFailure({ error: { errorObj: err } })))
        );
      })
    );
  });

  public loadSelectedTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.loadSelectedTeamRequested),
      concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
      concatMap(([action, user]) => of(user).pipe(withLatestFrom(this.teamFacade.selectTeams()))),
      filter(([user, teams]) => !!user.selectedTeamId && !teams[user.selectedTeamId]),
      map(([user, teams]) => user.selectedTeamId),
      switchMap((id: string) => this.teamService.loadTeam(id)),
      map((team: Team) => teamActions.loadTeamSuccess({ team })),
      catchError((err) => of(teamActions.loadTeamFailure({ error: { errorObj: err } })))
    );
  });

  public loadTeamFailure$ = this.errorEffectService.createFrom(this.actions$, teamActions.loadTeamFailure);
}
