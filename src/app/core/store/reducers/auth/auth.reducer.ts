import { Action, createReducer, on } from '@ngrx/store';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
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
  })),
  on(userActions.teamNameChanged, (state: AuthState, action) => {
    const currentTeams = [...state.user.teams];
    const updatedTeam = UserTeamBuilder.from(action.request.id, action.request.name).build();
    currentTeams[currentTeams.findIndex((t) => t.id === updatedTeam.id)] = updatedTeam;

    return {
      ...state,
      user: { ...state.user, teams: [...currentTeams] }
    };
  })
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
