import { teamActions } from 'src/app/core/store/actions/team.actions';
import { reducer, TeamState } from 'src/app/core/store/reducers/team/team.reducer';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { TeamStateTestDataBuilder } from 'src/app/core/team/utils/test/team-state-test-data.builder';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/test/teams-test-data.builder';

describe('Team Reducer', () => {
  const emptyState: TeamState = TeamStateTestDataBuilder.from().build();

  describe('On New Team Create Success', () => {
    it('should add team to the state', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test team').build();
      const expected = TeamStateTestDataBuilder.from().withTeam(team).build();

      const result = reducer(emptyState, teamActions.newTeamCreateSuccess({ team }));

      expect(result).toEqual(expected);
    });
  });

  describe('On Load Team Success', () => {
    it('should add loaded team to the state', () => {
      const team = TeamBuilder.from('999', new Date(), 'test user 9', 'test 999').build();

      const currentState = TeamStateTestDataBuilder.from()
        .withTeams(TeamsTestDataBuilder.withDefaultData().build())
        .build();

      const result = reducer(currentState, teamActions.loadTeamSuccess({ team }));

      expect(result.ids.length).toEqual(currentState.ids.length + 1);
      expect(result.ids.findIndex((x) => x === team.id) >= 0).toBeTrue();
    });
  });
});
