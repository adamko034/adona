import { createFeatureSelector, createSelector } from '@ngrx/store';
import { teamAdapterSelectors, TeamsState } from 'src/app/core/team/store/reducers/teams.reducer';

const selectTeamsState = createFeatureSelector<TeamsState>('teams');

const selectTeamsEntities = createSelector(selectTeamsState, teamAdapterSelectors.selectEntities);
const selectSelectedTeam = createSelector(selectTeamsState, (state) => state.selected);

export const teamsQueries = {
  selectSelectedTeam,
  selectTeams: selectTeamsEntities
};
