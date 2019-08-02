import { User } from 'src/app/core/auth/model/user-model';
import { AuthActions, AuthActionTypes } from '../../actions/auth.actions';

export interface AuthState {
  loggedIn: boolean;
  user: User;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user: undefined
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
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
