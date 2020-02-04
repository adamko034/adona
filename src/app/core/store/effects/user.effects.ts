import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { errors } from '../../../shared/constants/errors.constants';
import { Error } from '../../error/model/error.model';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { User } from '../../user/model/user.model';
import { UserService } from '../../user/services/user.service';
import { ErrorOccuredAction } from '../actions/error.actions';
import { userActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  public loadUser: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserRequested),
      switchMap(action => this.userService.loadUser(action.id)),
      map((user: User) => userActions.loadUserSuccess({ user }))
    )
  );

  public changeTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.changeTeamRequested),
      map(action => action.request),
      switchMap((request: ChangeTeamRequest) => this.userService.changeTeam(request)),
      map((request: ChangeTeamRequest) =>
        userActions.changeTeamSuccess({ teamId: request.teamId, updated: request.updated })
      ),
      catchError(err => of(userActions.changeTeamFailure({ error: { errorObj: err } })))
    );
  });

  public changeTeamFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.changeTeamFailure),
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
