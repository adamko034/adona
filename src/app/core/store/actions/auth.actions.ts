import { createAction, props } from '@ngrx/store';
import { Credentials } from 'src/app/core/auth/model/credentials.model';
import { User } from '../../user/model/user.model';

export const authActionTypes = {
  login: '[Login Page] Login',
  logout: '[Navbar] Logout',
  loginFailed: '[Authentication API] Login Failed',
  loginClearError: '[Login Page] Login Clear Error',
  loginSuccess: '[Database API] Login Success',
  logoutSucces: '[Databse API] Logout Success',
  emailNotVerified: '[Datbase API] Email Not Verified'
};

const login = createAction(authActionTypes.login, props<{ credentials: Credentials }>());
const loginFailed = createAction(authActionTypes.loginFailed);
const loginSuccess = createAction(authActionTypes.loginSuccess, props<{ user: User }>());
const loginClearError = createAction(authActionTypes.loginClearError);

const logout = createAction(authActionTypes.logout);
const logoutSuccess = createAction(authActionTypes.logoutSucces);

const emailNotVerified = createAction(authActionTypes.emailNotVerified);

export const authActions = {
  login,
  logout,
  loginFailed,
  loginClearError,
  loginSuccess,
  logoutSuccess,
  emailNotVerified
};
