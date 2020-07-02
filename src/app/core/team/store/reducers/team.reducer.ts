import { Action, createReducer, on } from '@ngrx/store';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';

export interface TeamState {
  team: Team;
}

const teamsReducer = createReducer(
  { team: null },
  on(teamsActions.team.loadTeamSuccess, (state, action) => ({ ...state, team: action.team }))
);

export function reducer(state: TeamState | undefined, action: Action) {
  return teamsReducer(state, action);
}
