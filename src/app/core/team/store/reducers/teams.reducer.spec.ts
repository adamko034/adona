import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';
import { reducer, TeamsState } from 'src/app/core/team/store/reducers/teams.reducer';

describe('Team Reducer', () => {
  describe('On Load Team Success', () => {
    it('should set team', () => {
      const team = TeamBuilder.from('1', new Date(), 'user1', 'team1', []).build();
      const result = reducer(undefined, teamsActions.team.loadTeamSuccess({ team }));

      const expectedState: TeamsState = {
        ids: ['1'],
        entities: {
          ['1']: team
        }
      };

      expect(result).toEqual(expectedState);
    });
  });

  describe('On Load Teams Success', () => {
    it('should add teams', () => {
      const members = [
        TeamMemberBuilder.from('user 1', 'url').build(),
        TeamMemberBuilder.from('user 2', 'url2').build()
      ];
      const teams = [
        TeamBuilder.from('1', new Date(), 'user 1', 'team 1', members).build(),
        TeamBuilder.from('2', new Date(), 'user 1', 'team 2', members).build()
      ];
      const expectedState: TeamsState = {
        ids: ['1', '2'],
        entities: {
          ['1']: teams[0],
          ['2']: teams[1]
        }
      };

      expect(reducer(undefined, teamsActions.teams.loadTeamsSuccess({ teams }))).toEqual(expectedState);
    });
  });

  describe('On Update Team Name Success', () => {
    it('should update team name', () => {
      const members = [
        TeamMemberBuilder.from('user 1', 'url').build(),
        TeamMemberBuilder.from('user 2', 'url2').build()
      ];
      const teams = [
        TeamBuilder.from('1', new Date(), 'user 1', 'team 1', members).build(),
        TeamBuilder.from('2', new Date(), 'user 1', 'team 2', members).build()
      ];
      const currentState: TeamsState = {
        ids: ['1', '2'],
        entities: {
          ['1']: teams[0],
          ['2']: teams[1]
        }
      };
      const team: Team = { ...teams[0], name: 'updated name' };
      const expectedState: TeamsState = {
        ids: ['1', '2'],
        entities: {
          ['1']: team,
          ['2']: teams[1]
        }
      };

      expect(reducer(currentState, teamsActions.team.updateNameSuccess({ team }))).toEqual(expectedState);
    });
  });
});
