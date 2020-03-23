import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/user/model/user.model';
import { UserTeamBuilder } from '../../../user/model/builders/user-team.builder';
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
  on(authActions.logoutSuccess, state => ({
    ...state,
    user: null,
    loginFailed: null
  })),
  on(userActions.loadUserSuccess, (state, action) => ({
    ...state,
    user: action.user
  })),
  on(authActions.loginFailed, state => ({ ...state, user: null, loginFailed: true })),
  on(authActions.loginClearError, state => ({ ...state, user: null, loginFailed: null })),
  on(userActions.changeTeamSuccess, (state, action) => ({
    ...state,
    user: {
      ...state.user,
      selectedTeamId: action.teamId,
      teams: state.user.teams.map(team => {
        if (team.id === action.teamId) {
          return { ...team, updated: action.updated };
        }

        return team;
      })
    }
  })),
  on(userActions.teamAdded, (state, action) => {
    const teams = state.user.teams ? [...state.user.teams] : [];
    teams.push(UserTeamBuilder.from(action.id, action.name, action.updated).build());

    return {
      ...state,
      user: {
        ...state.user,
        teams: [...teams]
      }
    };
  })
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
