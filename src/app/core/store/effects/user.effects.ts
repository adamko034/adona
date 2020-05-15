import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ErrorEffectService } from '../../services/store/error-effect.service';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { User } from '../../user/model/user.model';
import { UserService } from '../../user/services/user.service';
import { userActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private errorEffectService: ErrorEffectService,
    private guiFacade: GuiFacade
  ) {}

  public loadUserRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.loadUserRequested),
      switchMap((action) =>
        this.userService.loadUser(action.id).pipe(
          map((user: User) => userActions.loadUserSuccess({ user })),
          catchError((err) => of(userActions.loadUserFailure({ error: { errorObj: err } })))
        )
      )
    );
  });

  public changeTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.changeTeamRequested),
      tap(() => this.guiFacade.showLoading()),
      map((action) => action.request),
      switchMap((request: ChangeTeamRequest) =>
        this.userService.changeTeam(request).pipe(
          map(() => userActions.changeTeamSuccess({ teamId: request.teamId, updated: request.updated })),
          tap(() => this.guiFacade.hideLoading()),
          catchError((err) => of(userActions.changeTeamFailure({ error: { errorObj: err } })))
        )
      )
    );
  });

  public loadUserFailure$ = this.errorEffectService.createFrom(this.actions$, userActions.loadUserFailure);

  public changeTeamFailure$ = this.errorEffectService.createFrom(this.actions$, userActions.changeTeamFailure);

  public updateNameRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.updateNameRequested),
      switchMap((action) =>
        this.userService.updateName(action.id, action.newName).pipe(
          map((newName: string) => userActions.updateNameSuccess({ newName })),
          catchError((err) =>
            of(
              userActions.updateNameFailure({
                error: ErrorBuilder.from().withErrorObject(err).build()
              })
            )
          )
        )
      )
    );
  });

  public updateNameFailure$ = this.errorEffectService.createFrom(this.actions$, userActions.updateNameFailure);
}
