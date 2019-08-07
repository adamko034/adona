import { User } from 'src/app/core/auth/model/user-model';
import { AuthActions, AuthActionTypes } from '../../actions/auth.actions';

export interface AuthState {
  loggedIn: boolean;
  user: User;
  loginFailed: boolean;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user: undefined,
  loginFailed: false
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.Authenticated:
      return {
        loggedIn: true,
        loginFailed: false,
        user: action.payload
      };
    case AuthActionTypes.NotAuthenticated:
      return {
        loggedIn: false,
        loginFailed: false,
        user: undefined
      };
    case AuthActionTypes.LoginFailed:
      return {
        loggedIn: false,
        loginFailed: true,
        user: undefined
      };
    default:
      return state;
  }
}
