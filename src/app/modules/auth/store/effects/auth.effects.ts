import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CredentialsLogin } from './../../../../shared/models/auth/credentials-login.model';
import { NavigationService } from './../../../../shared/services/navigation/navigation.service';
import { FirebaseToAdonaLoginConverter } from './../../../../shared/utils/converters/firebase-to-adona-login.converter';
import {
  AuthActionTypes,
  AuthenticatedAction,
  GetAuthAction,
  LoginAction,
  NotAuthenitcatedAction
} from './../actions/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  @Effect()
  logIn$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LoginAction),
    map((action: LoginAction) => action.payload),
    switchMap((credentials: CredentialsLogin) => {
      return this.authService.login(credentials);
    }),
    tap(() => this.navigationService.toHome()),
    mapTo(new GetAuthAction())
  );

  @Effect()
  getAuth$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.GetAuthAction),
    switchMap(() => this.authService.authState$),
    map(authData => {
      if (authData) {
        const user = FirebaseToAdonaLoginConverter.convert(authData);
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
