import { TeamMembersBuilder } from '../model/builders/team-members.builder';
import { TeamBuilder } from '../model/builders/team.builder';
import { TeamUtilsService } from './team-utils.service';

describe('Team Utils Service', () => {
  let service: TeamUtilsService;

  beforeEach(() => {
    service = new TeamUtilsService();
  });

  describe('Get Members Count', () => {
    it('should return 0 if without members', () => {
      let team = TeamBuilder.from('123', new Date(), 'test user', 'test team').withMembers(null).build();
      expect(service.getMembersCount(team)).toEqual(0);

      team = TeamBuilder.from('123', new Date(), 'test user', 'test team').withMembers(undefined).build();
      expect(service.getMembersCount(team)).toEqual(0);

      team = TeamBuilder.from('123', new Date(), 'test user', 'test team').withMembers({}).build();
      expect(service.getMembersCount(team)).toEqual(0);
    });

    it('should return 5', () => {
      const team = TeamBuilder.from('123', new Date(), 'test', 'test')
        .withMembers(
          TeamMembersBuilder.from()
            .withMember('a', 'photourl')
            .withMember('b', 'photourl')
            .withMember('c', 'photourl')
            .withMember('d', 'photourl')
            .withMember('e', 'photourl')
            .build()
        )
        .build();

      expect(service.getMembersCount(team)).toEqual(5);
    });
  });
});
