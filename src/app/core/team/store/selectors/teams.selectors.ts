import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userQueries } from 'src/app/core/store/selectors/user.selectors';
import { Team } from 'src/app/core/team/model/team/team.model';
import * as fromReducer from 'src/app/core/team/store/reducers/teams.reducer';

const selectTeamState = createFeatureSelector<fromReducer.TeamsState>('teams');
const selectTeams = createSelector(selectTeamState, fromReducer.selectAll);
const selectTeamsEntities = createSelector(selectTeamState, fromReducer.selectEntities);
const selectSelectedTeam = createSelector(
  userQueries.selectedTeamId,
  selectTeamsEntities,
  (teamId, teams) => teams[teamId]
);
const selectOneTeam = createSelector(
  selectTeamsEntities,
  (entities: Dictionary<Team>, props: { id: string }) => entities[props.id]
);

export const teamQueries = {
  selectSelected: selectSelectedTeam,
  selectOne: selectOneTeam,
  selectAll: selectTeams
};
