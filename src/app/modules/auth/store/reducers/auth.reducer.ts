import { User } from '../../../../shared/models/auth/user-model';
import { AuthActionTypes, AuthActions } from '../actions/auth.actions';


export interface AuthState {
  loggedIn: boolean,
  user: User
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user: undefined
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginAction:
      return {
        loggedIn: true,
        user: action.payload.user
      }
    case AuthActionTypes.LogoutAction:
      return {
        loggedIn: false,
        user: undefined
      }
    default:
      return state;
  }
}
