import { teamActions } from 'src/app/core/team/store/actions/team.actions';
import { allTeamsActions } from 'src/app/core/team/store/actions/teams.actions';

export const teamsActions = {
  team: teamActions,
  teams: allTeamsActions
};
