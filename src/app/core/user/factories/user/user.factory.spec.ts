import { UserFactory } from 'src/app/core/user/factories/user/user.factory';
import { UserDto } from 'src/app/core/user/model/user/user-dto.model';
import { UserBuilder } from 'src/app/core/user/model/user/user.builder';
import { User } from 'src/app/core/user/model/user/user.model';

describe('User Factory', () => {
  let factory: UserFactory;

  beforeEach(() => {
    factory = new UserFactory();
  });

  describe('Dto From Firebase Auth', () => {
    it('should create User Dto', () => {
      const firebaseAuth = {
        photoUrl: 'url',
        displayName: 'test user',
        email: 'email',
        photoURL: 'url'
      } as any;
      const invitationId = null;
      const selectedTeamId = '123';

      const expected: UserDto = {
        email: firebaseAuth.email,
        name: firebaseAuth.displayName,
        photoUrl: firebaseAuth.photoURL,
        selectedTeamId,
        teams: [selectedTeamId]
      };

      const actual = factory.dtofromFirebaseAuth(firebaseAuth, invitationId, selectedTeamId);
      expect(actual).toEqual(expected);
    });

    it('should create User Dto with default photo url', () => {
      const firebaseAuth = {
        photoUrl: null,
        displayName: 'test user',
        email: 'email'
      } as any;
      const invitationId = null;
      const selectedTeamId = '123';

      const expected: UserDto = {
        email: firebaseAuth.email,
        name: firebaseAuth.displayName,
        photoUrl: UserBuilder.defaultPhotoUrl,
        selectedTeamId,
        teams: [selectedTeamId]
      };

      const actual = factory.dtofromFirebaseAuth(firebaseAuth, invitationId, selectedTeamId);
      expect(actual).toEqual(expected);
    });
  });

  describe('From Firebase User', () => {
    it('should create User', () => {
      const firebaseUser = {
        id: '123',
        email: 'email',
        name: 'test user',
        teams: [{ id: '1', name: 'team 1' }],
        selectedTeamId: '1',
        invitationId: '1234',
        photoURL: 'photo url'
      };

      const expected: User = {
        email: firebaseUser.email,
        id: firebaseUser.id,
        name: firebaseUser.name,
        teams: firebaseUser.teams,
        invitationId: firebaseUser.invitationId,
        photoUrl: firebaseUser.photoURL,
        selectedTeamId: firebaseUser.selectedTeamId
      };

      expect(factory.fromFirebaseUser(firebaseUser)).toEqual(expected);
    });
  });
});
