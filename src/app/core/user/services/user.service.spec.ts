import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { TeamDtoBuilder } from 'src/app/core/team/model/team/team-dto.builder';
import { UserService } from 'src/app/core/user/services/user.service';
import { firebaseConstants } from 'src/app/shared/constants/firebase/firebase-functions.constant';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('User Service', () => {
  let service: UserService;
  const user = UserTestBuilder.withDefaultData().withInvitationId('134').build();

  const {
    angularFirestore,
    teamFactory,
    userFactory,
    angularFireFunctions
  } = SpiesBuilder.init()
    .withTeamFactory()
    .withUserFactory()
    .withAngularFireFunctions()
    .withAngularFirestore()
    .withTimeService()
    .build();

  beforeEach(() => {
    service = new UserService(angularFirestore, teamFactory, userFactory, angularFireFunctions);

    angularFireFunctions.httpsCallable.calls.reset();
    angularFirestore.firestore.batch().commit.and.returnValue(Promise.resolve());
    angularFirestore.firestore.batch().set.calls.reset();
    angularFirestore.firestore.batch().update.calls.reset();

    angularFirestore.firestore.batch().commit.calls.reset();
    angularFirestore.firestore.batch.calls.reset();
  });

  describe('Load User', () => {
    it('should call Cloud Function and return Observable of User', (done) => {
      angularFireFunctions.httpsCallable.and.returnValue(() => of({ test: 'test' }));
      userFactory.fromFirebaseUser.and.returnValue(user);

      service.loadUser().subscribe((actual) => {
        expect(actual).toEqual(user);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFactory.fromFirebaseUser, 1, { test: 'test' });
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          angularFireFunctions.httpsCallable,
          1,
          firebaseConstants.functions.user.get
        );
        done();
      });
    });
  });

  describe('Change Team', () => {
    beforeEach(() => {
      angularFirestore.collection().doc().update.calls.reset();
    });

    it('should set Selected Team Id field and Updated of this team', () => {
      angularFirestore.collection().doc().update.and.returnValue(Promise.resolve());
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      service.changeTeam(user.id, '123').subscribe();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'users');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, user.id);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc().update, 1, {
        selectedTeamId: '123'
      });
    });
  });

  describe('Create User', () => {
    it('should call firebase batch', (done) => {
      const firebaseAuth: any = { uid: '1' };
      const teamId = '123';
      const team = TeamDtoBuilder.from('test', new Date(), '1').build();
      const userDto: any = { name: 'test user' };

      teamFactory.personalTeamDto.and.returnValue(team);
      userFactory.dtofromFirebaseAuth.and.returnValue(userDto);
      angularFirestore.createId.and.returnValue(teamId);

      service.createUser(firebaseAuth, 'inv1').subscribe(() => {
        expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
        expect(angularFirestore.firestore.batch().set).toHaveBeenCalledTimes(3);
        expect(angularFirestore.firestore.batch().commit).toHaveBeenCalledTimes(1);

        done();
      });
    });
  });

  describe('Update Name', () => {
    it('should update user name and return observable', () => {
      const id = '1';
      const newName = 'example';

      angularFirestore.collection().doc().update.and.returnValue(Promise.resolve());
      angularFirestore.collection().doc().update.calls.reset();
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      service.updateName(id, newName).subscribe((name) => expect(name).toEqual(newName));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'users');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, '1');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc().update, 1, { name: newName });
    });
  });

  describe('Handle Invitation', () => {
    it('should update firestore db', (done) => {
      const invitation = InvitationBuilder.from('1', 'recipient', 'sender', '123', 'team name').build();

      service.handleInvitation(user, invitation).subscribe(() => {
        expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
        expect(angularFirestore.firestore.batch().update).toHaveBeenCalledTimes(3);
        expect(angularFirestore.firestore.batch().commit).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw error if invitation id is not set', () => {
      const userWithoutInvitationId = { ...user, invitationId: null };

      expect(service.handleInvitation(userWithoutInvitationId, {} as any)).toBeObservable(
        cold('#', null, 'Invitiation Id not set')
      );
    });
  });
});
