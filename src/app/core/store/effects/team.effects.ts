import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { errors } from 'src/app/shared/constants/errors.constants';
import { Error } from '../../error/model/error.model';
import { Team } from '../../team/model/team.model';
import { TeamService } from '../../team/services/team.service';
import { TeamFacade } from '../../team/team.facade';
import { UserFacade } from '../../user/user.facade';
import { ErrorOccuredAction } from '../actions/error.actions';
import { teamActions } from '../actions/team.actions';
import { userActions } from '../actions/user.actions';

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions,
    private userFacade: UserFacade,
    private teamService: TeamService,
    private teamFacade: TeamFacade
  ) {}

  public newTeamRequested = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.newTeamRequested),
      concatMap(action => of(action).pipe(withLatestFrom(this.userFacade.selectUserId()))),
      switchMap(([action, uid]) => this.teamService.addTeam(action.request, uid)),
      switchMap((team: Team) => [
        teamActions.newTeamCreateSuccess({ team }),
        userActions.teamAdded({ id: team.id, name: team.name, updated: team.created }),
        userActions.changeTeamSuccess({ teamId: team.id, updated: team.created })
      ]),
      catchError(err => of(teamActions.newTeamCreateFailure({ error: { errorObj: err } })))
    );
  });

  public newTeamCreateFailure = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.newTeamCreateFailure),
      map(action => {
        const error: Error = {
          errorObj: action.error.errorObj,
          message: action.error.message ? action.error.message : errors.DEFAULT_API_POST_ERROR_MESSAGE
        };
        return error;
      }),
      map((error: Error) => new ErrorOccuredAction({ error }))
    );
  });

  public loadTeamRequested = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.loadTeamRequested),
      concatMap(action => of(action).pipe(withLatestFrom(this.teamFacade.selectTeams()))),
      filter(([action, teams]) => !teams[action.id]),
      map(([action, teams]) => action.id),
      switchMap((id: string) => this.teamService.loadTeam(id)),
      map((team: Team) => teamActions.loadTeamSuccess({ team })),
      catchError(err => of(teamActions.loadTeamFailure({ error: { errorObj: err } })))
    );
  });

  public loadSelectedTeamRequested = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.loadSelectedTeamRequested),
      concatMap(action => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
      concatMap(([action, user]) => of(user).pipe(withLatestFrom(this.teamFacade.selectTeams()))),
      filter(([user, teams]) => !user.selectedTeamId || !teams[user.selectedTeamId]),
      map(([user, teams]) => user.selectedTeamId),
      switchMap((id: string) => this.teamService.loadTeam(id)),
      map((team: Team) => teamActions.loadTeamSuccess({ team })),
      catchError(err => of(teamActions.loadTeamFailure({ error: { errorObj: err } })))
    );
  });
}
