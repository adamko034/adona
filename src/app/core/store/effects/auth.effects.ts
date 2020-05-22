import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
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

  public logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.login),
      switchMap((action) =>
        this.authService.login(action.credentials).pipe(
          switchMap(({ user }) => (user.emailVerified ? this.userService.loadUser(user.uid) : of(null))),
          map((user: User) => {
            if (!user?.invitationId && !!action.invitationId) {
              user.invitationId = action.invitationId;
            }

            return user;
          }),
          map((user: User) => (!!user ? authActions.loginSuccess({ user }) : authActions.emailNotVerified())),
          catchError(() => of(authActions.loginFailed()))
        )
      )
    );
  });

  public logInSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => this.navigationService.toHome())
      );
    },
    { dispatch: false }
  );

  public emailNotVerified$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.emailNotVerified),
        tap(() => this.navigationService.toVerifyEmail())
      );
    },
    { dispatch: false }
  );

  @Effect()
  public logOut$ = this.actions$.pipe(
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
