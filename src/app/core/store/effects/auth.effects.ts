import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { authActions } from 'src/app/core/store/actions/auth.actions';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserService } from 'src/app/core/user/services/user.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Logger } from 'src/app/shared/utils/logger/logger';

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
      switchMap((action) => {
        Logger.logDev('auth effect, log in');
        return this.authService.login(action.credentials).pipe(
          switchMap(({ user }) => (user.emailVerified ? this.userService.loadUser() : of(null))),
          map((user: User) => {
            Logger.logDev('auth effect, log in, got user');
            if (!user?.invitationId && !!action.invitationId) {
              user.invitationId = action.invitationId;
            }

            return user;
          }),
          map((user: User) => (!!user ? authActions.loginSuccess({ user }) : authActions.emailNotVerified())),
          catchError(() => of(authActions.loginFailed()))
        );
      })
    );
  });

  public logInSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => Logger.logDev('auth effects, log in success')),
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
