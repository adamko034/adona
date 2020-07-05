import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Team } from 'src/app/core/team/model/team/team.model';
import { settingsActions } from 'src/app/modules/settings/store/actions';

export interface SettingsTeamsState extends EntityState<Team> {}

const adapter = createEntityAdapter<Team>();
const initialState = adapter.getInitialState();

const settingsTeamsReducer = createReducer(
  initialState,
  on(settingsActions.teams.loadTeamsSuccess, (state, action) => adapter.addMany(action.teams, { ...state }))
);

export function reducer(state: SettingsTeamsState | undefined, action: Action) {
  return settingsTeamsReducer(state, action);
}

export const { selectAll } = adapter.getSelectors();
