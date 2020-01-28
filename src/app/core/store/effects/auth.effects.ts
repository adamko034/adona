import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
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
  logIn$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.login),
    map(action => action.credentials),
    switchMap((credentials: CredentialsLogin) => this.authService.login(credentials)),
    switchMap(() => this.authService.authState$.pipe(take(1))),
    switchMap(({ uid }) => this.userService.getUser(uid).pipe(take(1))),
    map((user: User) => authActions.loginSuccess({ user })),
    tap(() => this.navigationService.toHome()),
    catchError(() => of(authActions.loginFailed()))
  );

  @Effect()
  logOut$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.logout),
    switchMap(() => this.authService.logout()),
    mapTo(authActions.logoutSuccess()),
    tap(() => this.navigationService.toLogin())
  );
}
