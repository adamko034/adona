import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
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
      { user: { ...user, teams: [UserTeamBuilder.from('123', 'team 1').build()] }, expected: false },
      {
        user: {
          ...user,
          teams: [UserTeamBuilder.from('123', 'team 1').build(), UserTeamBuilder.from('124', 'team 2').build()]
        },
        expected: true
      }
    ].forEach((input) => {
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

  describe('Extract Username From Email', () => {
    ['test@test.com', 'test-123@emai.com'].forEach((input) => {
      it(`should return username from ${input}`, () => {
        expect(service.extractUsernameFromEmail(input)).toEqual(input.split('@')[0]);
      });
    });

    it('should handle empty email', () => {
      expect(service.extractUsernameFromEmail('')).toEqual('');
    });

    it('should handle null email', () => {
      expect(service.extractUsernameFromEmail(null)).toEqual('');
    });
  });
});
