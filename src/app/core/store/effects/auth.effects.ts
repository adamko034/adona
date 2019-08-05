import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { map, mapTo, switchMap, tap, catchError } from 'rxjs/operators';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { MapperService } from 'src/app/core/services/mapper/mapper.service';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';
import {
  AuthActionTypes,
  AuthenticatedAction,
  GetAuthAction,
  LoginAction,
  NotAuthenitcatedAction,
  LoginFailedAction
} from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private navigationService: NavigationService,
    private mapperService: MapperService
  ) {}

  @Effect()
  logIn$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LoginAction),
    map((action: LoginAction) => action.payload),
    switchMap((credentials: CredentialsLogin) => {
      return this.authService.login(credentials);
    }),
    tap(() => this.navigationService.toHome()),
    mapTo(new GetAuthAction()),
    catchError(() => of(new LoginFailedAction()))
  );

  @Effect()
  getAuth$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.GetAuthAction),
    switchMap(() => this.authService.authState$),
    map(authData => {
      if (authData) {
        const user = this.mapperService.Users.toUser(authData);
        return new AuthenticatedAction(user);
      }

      return new NotAuthenitcatedAction();
    })
  );

  @Effect()
  logOut$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LogoutAction),
    switchMap(() => from(this.authService.logout())),
    mapTo(new NotAuthenitcatedAction()),
    tap(() => this.navigationService.toLogin())
  );
}
