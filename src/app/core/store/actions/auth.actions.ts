import { createAction, props } from '@ngrx/store';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { User } from '../../user/model/user-model';

export const authActionTypes = {
  login: '[Login Page] Login',
  logout: '[Navbar] Logout',
  loginFailed: '[Authentication API] Login Failed',
  loginSuccess: '[Database API] Login Success',
  logoutSucces: '[Databse API] Logout Success',
  findUser: '[Auth Guard] Find User',
  userFound: '[Database API] User Found',
  teamChanged: '[Datebase API] Team Changed',
  teamAdded: '[Database API] Team Added'
};

const login = createAction(authActionTypes.login, props<{ credentials: CredentialsLogin }>());
const loginFailed = createAction(authActionTypes.loginFailed);
const loginSuccess = createAction(authActionTypes.loginSuccess, props<{ user: User }>());

const logout = createAction(authActionTypes.logout);
const logoutSuccess = createAction(authActionTypes.logoutSucces);

export const authActions = {
  login,
  logout,
  loginFailed,
  loginSuccess,
  logoutSuccess
};
