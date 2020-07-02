import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/user/model/user/user.model';
import { authActions } from '../../actions/auth.actions';
import { userActions } from '../../actions/user.actions';

export interface AuthState {
  user: User;
  loginFailed: boolean;
}

export const authInitialState: AuthState = {
  user: null,
  loginFailed: null
};

const authReducer = createReducer(
  authInitialState,
  on(authActions.loginSuccess, (state, action) => ({
    ...state,
    user: action.user,
    loginFailed: null
  })),
  on(authActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loginFailed: null
  })),
  on(userActions.loadUserSuccess, (state, action) => ({
    ...state,
    user: action.user
  })),
  on(authActions.loginFailed, (state) => ({ ...state, user: null, loginFailed: true })),
  on(authActions.loginClearError, (state) => ({ ...state, user: null, loginFailed: null })),
  on(userActions.changeTeamSuccess, (state, action) => ({
    ...state,
    user: {
      ...state.user,
      selectedTeamId: action.teamId
    }
  })),
  on(userActions.updateNameSuccess, (state, action) => {
    return { ...state, user: { ...state.user, name: action.newName } };
  }),
  on(userActions.handleInvitationSuccess, (state) => {
    return { ...state, user: { ...state.user, invitationId: null } };
  }),
  on(userActions.handleInvitationReject, (state) => ({ ...state, user: { ...state.user, invitationId: null } })),
  on(userActions.teamAdded, (state, action) => ({
    ...state,
    user: { ...state.user, teams: [...state.user.teams, action.team] }
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
