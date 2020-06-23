import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';

export interface TeamsState extends EntityState<Team> {
  selected: Team;
}

const adapter = createEntityAdapter<Team>();
const teamsInitialState = adapter.getInitialState({
  selected: null
});

const teamsReducer = createReducer(
  teamsInitialState,
  on(teamsActions.selectedTeam.loadSelectedTeamSuccess, (state, action) => ({ ...state, selected: action.team }))
  // on(teamActions.newTeamCreateSuccess, (state, action) => adapter.addOne(action.team, { ...state })),
  // on(teamActions.loadTeamSuccess, (state, action) => adapter.addOne(action.team, { ...state }))
);

const { selectEntities } = adapter.getSelectors();

export const teamAdapterSelectors = {
  selectEntities
};

export function reducer(state: TeamsState | undefined, action: Action) {
  return teamsReducer(state, action);
}
