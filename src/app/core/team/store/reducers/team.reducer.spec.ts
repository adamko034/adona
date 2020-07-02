import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { reducer } from 'src/app/core/team/store/reducers/team.reducer';

describe('Team Reducer', () => {
  describe('On Load Team Success', () => {
    it('should set team', () => {
      const team = TeamBuilder.from('1', new Date(), 'user1', 'team1', []).build();
      const result = reducer({ team: {} as any }, teamsActions.team.loadTeamSuccess({ team }));

      expect(result.team).toEqual(team);
    });
  });
});
