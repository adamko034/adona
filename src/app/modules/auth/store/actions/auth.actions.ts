import { Action } from '@ngrx/store';
import { CredentialsLogin } from 'src/app/shared/models/auth/credentials-login.model';
import { User } from 'src/app/shared/models/auth/user-model';

export enum AuthActionTypes {
  GetAuthAction = '[GetAuth] Action',
  AuthenticatedAction = '[Authenitcated] Action',
  NotAuthenticatedAction = '[Not Authenitcated] Action',
  LoginAction = '[Login] Action',
  LogoutAction = '[Logout] Action'
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: CredentialsLogin) {}
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class GetAuthAction implements Action {
  readonly type = AuthActionTypes.GetAuthAction;

  constructor() {}
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
  | LogoutAction;
