import { Action } from '@ngrx/store';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { User } from 'src/app/core/auth/model/user-model';

export enum AuthActionTypes {
  AuthRequested = '[Page] Auth Requested',
  Authenticated = '[Authenitcation API] Authenitcated',
  NotAuthenticated = '[Authenitcation API] Not Authenticated',
  Login = '[Login Page] Login',
  Logout = '[Navbar] Logout',
  LoginFailed = '[Authentication API] Login Failed'
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: CredentialsLogin) {}
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LoginFailedAction implements Action {
  readonly type = AuthActionTypes.LoginFailed;
}

export class AuthRequestedAction implements Action {
  readonly type = AuthActionTypes.AuthRequested;
}

export class AuthenticatedAction implements Action {
  readonly type = AuthActionTypes.Authenticated;

  constructor(public payload: User) {}
}

export class NotAuthenitcatedAction implements Action {
  readonly type = AuthActionTypes.NotAuthenticated;
}

export type AuthActions =
  | AuthRequestedAction
  | AuthenticatedAction
  | NotAuthenitcatedAction
  | LoginAction
  | LogoutAction
  | LoginFailedAction;
