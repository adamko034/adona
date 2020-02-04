import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/user/model/user.model';
import { authActions } from '../../actions/auth.actions';
import { userActions } from '../../actions/user.actions';

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
  on(userActions.loadUserSuccess, (state, action) => ({
    ...state,
    user: action.user
  })),
  on(authActions.loginFailed, state => ({ ...state, loggedIn: false, user: null, loginFailed: true })),
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
  on(userActions.teamAdded, (state, action) => ({
    ...state,
    user: {
      ...state.user,
      teams: [...state.user.teams, { id: action.id, updated: action.updated, name: action.name }]
    }
  }))
);
