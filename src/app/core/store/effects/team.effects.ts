import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { NewInvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { DefaultErrorType } from '../../error/enum/default-error-type.enum';
import { ErrorEffectService } from '../../services/store/error-effect.service';
import { Team } from '../../team/model/team.model';
import { TeamService } from '../../team/services/team.service';
import { TeamFacade } from '../../team/team.facade';
import { UserFacade } from '../../user/user.facade';
import { teamActions } from '../actions/team.actions';
import { userActions } from '../actions/user.actions';

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions,
    private userFacade: UserFacade,
    private teamService: TeamService,
    private teamFacade: TeamFacade,
    private errorEffectService: ErrorEffectService,
    private guiFacade: GuiFacade,
    private invitationsFacade: InvitationsFacade
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
          const invitationsReqeust = NewInvitationRequestBuilder.from(user, action.team).build();
          this.invitationsFacade.send(invitationsReqeust);
          this.guiFacade.hideLoading();

          return action;
        })
      );
    },
    { dispatch: false }
  );

  public newTeamCreateFailure$ = this.errorEffectService.createFrom(
    this.actions$,
    teamActions.newTeamCreateFailure,
    DefaultErrorType.ApiPost
  );

  public loadTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.loadTeamRequested),
      concatMap((action) => of(action).pipe(withLatestFrom(this.teamFacade.selectTeams()))),
      filter(([action, teams]) => !teams[action.id]),
      map(([action, teams]) => action.id),
      switchMap((id: string) => this.teamService.loadTeam(id)),
      map((team: Team) => teamActions.loadTeamSuccess({ team })),
      catchError((err) => of(teamActions.loadTeamFailure({ error: { errorObj: err } })))
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

  public loadTeamFailure$ = this.errorEffectService.createFrom(
    this.actions$,
    teamActions.loadTeamFailure,
    DefaultErrorType.ApiGet
  );
}
