import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/user/model/user-model';
import { authActions } from '../../actions/auth.actions';

export interface AuthState {
  user: User;
  loginFailed: boolean;
}

export const authInitialState: AuthState = {
  user: null,
  loginFailed: false
};

export const authReducer = createReducer(
  authInitialState,
  on(authActions.loginSuccess, (state, action) => ({
    ...state,
    user: action.user,
    loginFailed: false
  })),
  on(authActions.logoutSuccess, state => ({
    ...state,
    user: null,
    loginFailed: false
  })),
  on(authActions.userFound, (state, action) => ({
    ...state,
    user: action.user,
    loginFailed: false
  })),
  on(authActions.loginFailed, state => ({ ...state, loggedIn: false, user: null, loginFailed: true }))
);
