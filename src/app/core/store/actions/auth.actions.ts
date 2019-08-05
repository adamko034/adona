import { Action } from '@ngrx/store';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { User } from 'src/app/core/auth/model/user-model';

export enum AuthActionTypes {
  GetAuthAction = '[GetAuth] Action',
  AuthenticatedAction = '[Authenitcated] Action',
  NotAuthenticatedAction = '[Not Authenitcated] Action',
  LoginAction = '[Login] Action',
  LogoutAction = '[Logout] Action',
  LoginFailedAction = '[Login Failed] Action'
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: CredentialsLogin) {}
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class LoginFailedAction implements Action {
  readonly type = AuthActionTypes.LoginFailedAction;
}

export class GetAuthAction implements Action {
  readonly type = AuthActionTypes.GetAuthAction;
}

export class AuthenticatedAction implements Action {
  readonly type = AuthActionTypes.AuthenticatedAction;

  constructor(public payload: User) {}
}

export class NotAuthenitcatedAction implements Action {
  readonly type = AuthActionTypes.NotAuthenticatedAction;
}

export type AuthActions =
  | GetAuthAction
  | AuthenticatedAction
  | NotAuthenitcatedAction
  | LoginAction
  | LogoutAction
  | LoginFailedAction;
