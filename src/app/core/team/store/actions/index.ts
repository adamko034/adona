import { selectedTeamActions } from 'src/app/core/team/store/actions/selected-team/selected-team.actions';
import { allTeamsActions } from 'src/app/core/team/store/actions/teams/teams.actions';

export const teamsActions = {
  selectedTeam: selectedTeamActions,
  teams: allTeamsActions
};
