import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { UserTeamBuilder } from '../model/builders/user-team.builder';
import { UserUtilservice } from './user-utils.service';

describe('User Utils Service', () => {
  const user = UserTestBuilder.withDefaultData().build();
  let service: UserUtilservice;

  beforeEach(() => {
    service = new UserUtilservice();
  });

  describe('Has Multiple Teams', () => {
    [
      { user: null, expected: false },
      { user: { ...user, teams: null }, expected: false },
      { user: { ...user, teams: [] }, expected: false },
      { user: { ...user, teams: [UserTeamBuilder.from('123', 'team 1', new Date()).build()] }, expected: false },
      {
        user: {
          ...user,
          teams: [
            UserTeamBuilder.from('123', 'team 1', new Date()).build(),
            UserTeamBuilder.from('124', 'team 2', new Date()).build()
          ]
        },
        expected: true
      }
    ].forEach(input => {
      let testTitle = '';
      if (!input.user) {
        testTitle = `should return ${input.expected} when user is null`;
      } else if (!input.user.teams) {
        testTitle = `should return ${input.expected} where user teams are null`;
      } else {
        testTitle = `should return ${input.expected} where user has ${input.user.teams.length} teams`;
      }

      it(testTitle, () => {
        expect(service.hasMultipleTeams(input.user)).toEqual(input.expected);
      });
    });
  });

  describe('Get Selected Team', () => {
    [
      { user: null, expected: null },
      { user: { ...user, teams: null }, expected: null },
      {
        user: { ...user, selectedTeamId: '124', teams: [UserTeamBuilder.from('123', 'test', new Date()).build()] },
        expected: undefined
      },
      {
        user: {
          ...user,
          selectedTeamId: '123',
          teams: [
            UserTeamBuilder.from('123', 'test', new Date()).build(),
            UserTeamBuilder.from('124', 'test 2', new Date()).build()
          ]
        },
        expected: UserTeamBuilder.from('123', 'test', new Date()).build()
      }
    ].forEach(input => {
      let testTitle = '';
      if (!input.user) {
        testTitle = `should return ${input.expected} when user is null`;
      } else if (!input.user.teams) {
        testTitle = `should return ${input.expected} where user teams are null`;
      } else if (input.expected === undefined) {
        testTitle = 'should return undefined when user does not have selected team';
      } else {
        testTitle = `should return team: ${input.expected.id} where user has this team`;
      }

      it(testTitle, () => {
        expect(service.getSelectedTeam(input.user)).toEqual(input.expected);
      });
    });
  });
});
