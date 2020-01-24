import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Team } from 'src/app/core/team/model/team.model';
import { teamActions } from '../../actions/team.actions';

export interface TeamState {}

const adapter = createEntityAdapter<Team>();
const teamInitialState = adapter.getInitialState();

export const teamReducer = createReducer(
  teamInitialState,
  on(teamActions.newTeamCreateSuccess, (state, action) => adapter.addOne(action.team, { ...state }))
);
