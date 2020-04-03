import { TeamBuilder } from '../../../team/model/builders/team.builder';
import { TeamStateTestDataBuilder } from '../../../team/utils/test/team-state-test-data.builder';
import { TeamsTestDataBuilder } from '../../../team/utils/test/teams-test-data.builder';
import { teamActions } from '../../actions/team.actions';
import * as fromReducer from './team.reducer';

describe('Team Reducer', () => {
  const emptyState: fromReducer.TeamState = TeamStateTestDataBuilder.from().build();

  describe('On New Team Create Success', () => {
    it('should add team to the state', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test team').build();
      const expected = TeamStateTestDataBuilder.from()
        .withTeam(team)
        .build();

      const result = fromReducer.reducer(emptyState, teamActions.newTeamCreateSuccess({ team }));

      expect(result).toEqual(expected);
    });
  });

  describe('On Load Team Success', () => {
    it('should add loaded team to the state', () => {
      const team = TeamBuilder.from('999', new Date(), 'test user 9', 'test 999').build();

      const currentState = TeamStateTestDataBuilder.from()
        .withTeams(TeamsTestDataBuilder.withDefaultData().build())
        .build();

      const result = fromReducer.reducer(currentState, teamActions.loadTeamSuccess({ team }));

      expect(result.ids.length).toEqual(currentState.ids.length + 1);
      expect(result.ids.findIndex(x => x === team.id) >= 0).toBeTrue();
    });
  });
});
