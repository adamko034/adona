import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Team } from 'src/app/core/team/model/team.model';
import { teamActions } from '../../actions/team.actions';

export interface TeamState extends EntityState<Team> {}

const adapter = createEntityAdapter<Team>();
const teamInitialState = adapter.getInitialState({});

export const teamReducer = createReducer(
  teamInitialState,
  on(teamActions.newTeamCreateSuccess, (state, action) => adapter.addOne(action.team, { ...state })),
  on(teamActions.loadTeamSuccess, (state, action) => adapter.addOne(action.team, { ...state }))
);

const { selectEntities } = adapter.getSelectors();

export const teamAdapterSelectors = {
  selectEntities
};
