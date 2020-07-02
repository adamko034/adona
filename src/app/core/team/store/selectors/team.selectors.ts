import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeamState } from 'src/app/core/team/store/reducers/team.reducer';

const selectTeamState = createFeatureSelector<TeamState>('team');

const selectTeam = createSelector(selectTeamState, (state) => state.team);

export const teamQueries = {
  selectTeam
};
