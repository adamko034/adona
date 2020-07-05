import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from 'src/app/modules/settings/store/reducers';
import * as fromTeams from 'src/app/modules/settings/store/reducers/teams/settings-teams.reducer';

const selectSettingsState = createFeatureSelector<SettingsState>('settings');
const selectSettingsTeamsState = createSelector(selectSettingsState, (state) => state.teams);
const selectTeams = createSelector(selectSettingsTeamsState, fromTeams.selectAll);

const teams = {
  selectAll: selectTeams
};

export const settingsQueries = {
  teams
};
