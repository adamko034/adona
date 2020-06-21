import { cold } from 'jasmine-marbles';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

describe('Invitations Service', () => {
  let service: InvitationsService;
  const recipients = ['user1@example.com', 'user2@example.com'];
  const user = UserTestBuilder.withDefaultData().build();
  const members = TeamMembersBuilder.from()
    .withMember('user1', null, recipients[0])
    .withMember('user2', null, recipients[1])
    .build();
  const team = TeamBuilder.from('team1', new Date(), user.name, 'team 1').withMembers(members).build();

  const { timeService, angularFirestore } = SpiesBuilder.init().withAngularFirestore().withTimeService().build();

  beforeEach(() => {
    service = new InvitationsService(angularFirestore, timeService);
  });

  describe('Add Invitation', () => {
    beforeEach(() => {
      angularFirestore.createId.and.returnValues('1', '2');
      angularFirestore.firestore.batch().commit.and.returnValue(Promise.resolve());
      angularFirestore.firestore.batch.calls.reset();
    });

    it('should add requests for all members', () => {
      const request = InvitationRequestBuilder.from('user@example.com', '123', 'team 123', [
        'test1@example.com',
        'test2@example.com'
      ]).build();
      service.addInvitation(request);

      expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
      expect(angularFirestore.createId).toHaveBeenCalledTimes(4);
      expect(angularFirestore.firestore.batch().set).toHaveBeenCalledTimes(2);
    });
  });

  describe('Get', () => {
    const dtNow = new Date();
    beforeEach(() => {
      timeService.Creation.fromFirebaseTimestamp.calls.reset();
      timeService.Creation.fromFirebaseTimestamp.and.returnValue(dtNow);
    });

    it('should get invitation from firebase', () => {
      const invFirebase = {
        recipientEmail: 'user@example.com',
        senderEmail: 'sender@example.com',
        teamId: '123',
        teamName: 'team 123',
        created: dtNow,
        status: 'sent',
        otherField: 'othervalue'
      };
      angularFirestore
        .collection()
        .doc()
        .valueChanges.and.returnValue(cold('x-x', { x: invFirebase }));

      const inv = service.get('inv1');

      expect(angularFirestore.collection).toHaveBeenCalledWith('invitations');
      expect(angularFirestore.collection().doc).toHaveBeenCalledWith('inv1');
      expect(angularFirestore.collection().doc().valueChanges).toHaveBeenCalled();

      const expectedInv = InvitationBuilder.from(
        'inv1',
        invFirebase.recipientEmail,
        invFirebase.senderEmail,
        invFirebase.teamId,
        invFirebase.teamName
      )
        .withCreated(dtNow)
        .withStatus(invFirebase.status as any)
        .build();

      expect(inv).toBeObservable(cold('(x|)', { x: expectedInv }));
    });
  });
});
