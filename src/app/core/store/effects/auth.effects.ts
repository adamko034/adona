import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { User } from '../../user/model/user.model';
import { UserService } from '../../user/services/user.service';
import { authActions } from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {}

  @Effect()
  public logIn$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.login),
    map(action => action.credentials),
    switchMap((credentials: CredentialsLogin) =>
      this.authService.login(credentials).pipe(
        switchMap(() => this.authService.getAuthState().pipe(take(1))),
        switchMap(({ uid }) => this.userService.loadUser(uid)),
        map((user: User) => authActions.loginSuccess({ user })),
        catchError(() => of(authActions.loginFailed()))
      )
    )
  );

  public logInSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => this.navigationService.toHome())
      );
    },
    { dispatch: false }
  );

  @Effect()
  public logOut$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.logout),
    switchMap(() => this.authService.logout()),
    mapTo(authActions.logoutSuccess())
  );

  public logOutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        tap(() => this.navigationService.toLogin())
      );
    },
    { dispatch: false }
  );
}
