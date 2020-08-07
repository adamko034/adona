import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';

export interface TeamsState extends EntityState<Team> {}

const adapter = createEntityAdapter<Team>();
const initialState = adapter.getInitialState();

const teamsReducer = createReducer(
  initialState,
  on(teamsActions.teams.loadTeamsSuccess, (state, action) => adapter.addMany(action.teams, { ...state })),
  on(teamsActions.team.loadTeamSuccess, (state, action) => adapter.upsertOne(action.team, { ...state })),
  on(teamsActions.team.updateNameSuccess, (state, action) => adapter.upsertOne(action.team, { ...state })),
  on(teamsActions.team.deleteTeamSuccess, (state, action) => adapter.removeOne(action.id, { ...state }))
);

export function reducer(state: TeamsState | undefined, action: Action) {
  return teamsReducer(state, action);
}

export const { selectAll, selectEntities } = adapter.getSelectors();
