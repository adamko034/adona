import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/builders/team.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Invitations Service', () => {
  let service: InvitationsService;
  const recipients = ['user1@example.com', 'user2@example.com'];
  const user = UserTestBuilder.withDefaultData().build();
  const members = TeamMembersBuilder.from()
    .withMember('user1', null, recipients[0])
    .withMember('user2', null, recipients[1])
    .build();
  const team = TeamBuilder.from('team1', new Date(), user.name, 'team 1').withMembers(members).build();

  const {
    teamUtilsService,
    angularFirestore
  } = SpiesBuilder.init().withAngularFirestore().withTeamUtilsService().build();

  beforeEach(() => {
    service = new InvitationsService(angularFirestore, teamUtilsService);
  });

  describe('Add Requests', () => {
    beforeEach(() => {
      teamUtilsService.getMembersEmails.and.returnValue(recipients);
      angularFirestore.createId.and.returnValues('1', '2');
      angularFirestore.firestore.batch().commit.and.returnValue(Promise.resolve());
      angularFirestore.firestore.batch.calls.reset();
    });

    it('should add requests for all members', () => {
      service.addRequests({ sender: user, team });

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamUtilsService.getMembersEmails, 1, team);
      expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
      expect(angularFirestore.createId).toHaveBeenCalledTimes(2);
      expect(angularFirestore.firestore.batch().set).toHaveBeenCalledTimes(2);
    });
  });
});
