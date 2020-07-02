import { TeamDto } from 'src/app/core/team/model/team/team-dto.model';
import { UserTeamFactory } from 'src/app/core/user/factories/user-team/user-team.factory';
import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';

describe('User Team Factory', () => {
  let factory: UserTeamFactory;

  beforeEach(() => {
    factory = new UserTeamFactory();
  });

  describe('From Team DTO', () => {
    it('should return User Team object', () => {
      const teamDto: TeamDto = { created: new Date(), createdByUid: '1234', name: 'test team' };
      const expected: UserTeam = { id: '123', name: 'test team' };

      const actual = factory.fromTeamDto('123', teamDto);
      expect(actual).toEqual(expected);
    });
  });
});
