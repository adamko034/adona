import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { MapperService } from 'src/app/core/services/mapper/mapper.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import {
  AuthActionTypes,
  AuthenticatedAction,
  AuthRequestedAction,
  LoginAction,
  LoginFailedAction,
  NotAuthenitcatedAction
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
    ofType(AuthActionTypes.Login),
    map((action: LoginAction) => action.payload),
    switchMap((credentials: CredentialsLogin) => {
      return this.authService.login(credentials).pipe(
        mapTo(new AuthRequestedAction()),
        tap(() => this.navigationService.toHome()),
        catchError(() => of(new LoginFailedAction()))
      );
    })
  );

  @Effect()
  authRequested: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.AuthRequested),
    mergeMap(() => this.authService.authState$),
    map((firebaseUser: firebase.User) => {
      if (firebaseUser) {
        const user = this.mapperService.Users.toUser(firebaseUser);
        return new AuthenticatedAction(user);
      }

      return new NotAuthenitcatedAction();
    })
  );

  @Effect()
  logOut$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    switchMap(() => this.authService.logout()),
    mapTo(new NotAuthenitcatedAction()),
    tap(() => this.navigationService.toLogin())
  );
}
