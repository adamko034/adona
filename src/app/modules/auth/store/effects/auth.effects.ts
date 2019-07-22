import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap, mergeMap, mapTo, catchError } from 'rxjs/operators';
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
import { Action } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private navigationService: NavigationService
  ) { }

  @Effect()
  logIn$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LoginAction),
    map((action: LoginAction) => action.payload),
    switchMap((credentials: CredentialsLogin) => {
      return from(this.authService.login(credentials));
    }),
    tap(() => this.navigationService.toHome()),
    mapTo(new GetAuthAction())
  );

  @Effect()
  getAuth$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.GetAuthAction),
    tap(() => console.log('tap')),
    switchMap(() => this.authService.authState$),
    map(authData => {
      console.log(authData);
      if (authData) {
        const user = FirebaseToAdonaLoginConverter.convert(authData);
        return new AuthenticatedAction(user);
      }

      return new NotAuthenitcatedAction()
    }),
    catchError((err) => of(console.log(err)))
  );

  @Effect()
  logOut$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LogoutAction),
    switchMap(() => from(this.authService.logout())),
    mapTo(new NotAuthenitcatedAction()),
    tap(() => this.navigationService.toLogin())
  );
}
