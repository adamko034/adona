import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamUtilsService } from 'src/app/core/team/services/team-utils.service';

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

  describe('Is At Least One Member With Email', () => {
    [null, undefined, {}].forEach((members) => {
      it(`should return false is members are: ${members}`, () => {
        expect(service.isAtLeastOneMemberWithEmail(createTeam(members))).toEqual(false);
      });
    });

    it('should return false if there is no member with email', () => {
      const members = TeamMembersBuilder.from()
        .withMember('1', null)
        .withMember('2', null, null)
        .withMember('3', null, '')
        .build();
      expect(service.isAtLeastOneMemberWithEmail(createTeam(members))).toEqual(false);
    });

    it('should return true if there is a member with email', () => {
      const members = TeamMembersBuilder.from()
        .withMember('1', null)
        .withMember('2', null, null)
        .withMember('3', null, 'user@example.com')
        .build();
      expect(service.isAtLeastOneMemberWithEmail(createTeam(members))).toEqual(true);
    });
  });

  describe('Get Members Emails', () => {
    it('should return empty table if there are no members', () => {
      expect(service.getMembersEmails(createTeam({}))).toEqual([]);
    });

    it('should return members emails', () => {
      const members = TeamMembersBuilder.from()
        .withMember('1', null, 'user1@example.com')
        .withMember('2', null)
        .withMember('3', null, null)
        .withMember('4', null, '')
        .withMember('5', null, 'user5@example.com')
        .build();

      expect(service.getMembersEmails(createTeam(members))).toEqual(['user1@example.com', 'user5@example.com']);
    });
  });

  describe('Get Members Emails Without', () => {
    it('should return empty array', () => {
      const team = TeamBuilder.from('1', new Date(), 'user', 'team').build();

      expect(service.getMembersEmailsWithout(team, 'email3')).toEqual([]);
    });

    it('should return emails filtered', () => {
      const members = TeamMembersBuilder.from()
        .withMember('withoutEmail', 'phoUrl')
        .withMember('withEmail1', 'photoUrl', 'email1')
        .withMember('withEmail2', 'photoUrl', 'email2')
        .withMember('withEmail3', 'photoUrl', 'email3')
        .build();

      const team = TeamBuilder.from('1', new Date(), 'user', 'team').withMembers(members).build();

      expect(service.getMembersEmailsWithout(team, 'email3')).toEqual(['email1', 'email2']);
    });
  });
});

function createTeam(members: any): Team {
  return TeamBuilder.from('1', new Date(), 'user', 'team 1').withMembers(members).build();
}
