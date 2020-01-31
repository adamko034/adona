import { createFeatureSelector, createSelector } from '@ngrx/store';
import { teamAdapterSelectors, TeamState } from '../reducers/team/team.reducer';
import { userQueries } from './user.selectors';

const selectTeamState = createFeatureSelector<TeamState>('team');

const selectTeamEntities = createSelector(selectTeamState, teamAdapterSelectors.selectEntities);

const selectSelectedTeam = createSelector(selectTeamEntities, userQueries.selectUser, (teams, user) => {
  if (user) {
    return teams[user.selectedTeamId];
  }

  return null;
});

export const teamQueries = {
  selectSelectedTeam,
  selectTeams: selectTeamEntities
};
