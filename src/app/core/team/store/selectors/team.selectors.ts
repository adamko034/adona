import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userQueries } from 'src/app/core/store/selectors/user.selectors';
import { teamAdapterSelectors, TeamState } from 'src/app/core/team/store/reducers/team.reducer';

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
