import { User } from '../../../../shared/models/auth/user-model';
import { AuthActions } from '../actions/auth.actions';
import { AuthActionTypes } from './../actions/auth.actions';

export interface AuthState {
  loggedIn: boolean;
  user: User;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user: undefined
};

export function authReducer(
  state = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.AuthenticatedAction:
      return {
        loggedIn: true,
        user: action.payload
      };
    case AuthActionTypes.NotAuthenticatedAction:
      return {
        loggedIn: false,
        user: undefined
      };
    default:
      return state;
  }
}
