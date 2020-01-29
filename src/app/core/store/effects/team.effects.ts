import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { errors } from 'src/app/shared/constants/errors.constants';
import { Error } from '../../error/model/error.model';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { Team } from '../../team/model/team.model';
import { TeamService } from '../../team/services/team.service';
import { UserFacade } from '../../user/user.facade';
import { ErrorOccuredAction } from '../actions/error.actions';
import { teamActions } from '../actions/team.actions';
import { userActions } from '../actions/user.actions';

@Injectable()
export class TeamEffects {
  constructor(private actions$: Actions, private userFacade: UserFacade, private teamService: TeamService) {}

  public newTeamRequested = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.newTeamRequested),
      withLatestFrom(this.userFacade.getUser()),
      switchMap(([action, user]) => this.teamService.addTeam(action.request, user)),
      switchMap((team: Team) => [
        teamActions.newTeamCreateSuccess({ team }),
        userActions.teamAdded({ id: team.id, name: team.name, updated: team.created }),
        userActions.teamChanged({ teamId: team.id, updated: team.created })
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

  public changeTeamRequested = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.changeTeamRequested),
      map(action => action.request),
      switchMap((request: ChangeTeamRequest) => this.teamService.changeTeam(request)),
      map((request: ChangeTeamRequest) =>
        userActions.teamChanged({ teamId: request.teamId, updated: request.updated })
      ),
      catchError(err => of(teamActions.changeTeamFailure({ error: { errorObj: err } })))
    );
  });

  public changeTeamFailure = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamActions.changeTeamFailure),
      map(action => {
        const error: Error = {
          errorObj: action.error.errorObj,
          message: action.error.message ? action.error.message : errors.DEFAULT_API_OTHER_ERROR_MESSAGE
        };
        return error;
      }),
      map((error: Error) => new ErrorOccuredAction({ error }))
    );
  });
}
