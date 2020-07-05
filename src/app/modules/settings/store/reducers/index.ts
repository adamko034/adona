import { ActionReducerMap } from '@ngrx/store';
import * as fromTeams from 'src/app/modules/settings/store/reducers/teams/settings-teams.reducer';

export interface SettingsState {
  teams: fromTeams.SettingsTeamsState;
}

export const settingsReducers: ActionReducerMap<SettingsState> = {
  teams: fromTeams.reducer
};
