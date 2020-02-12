import { fakeAsync } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { UserTeamBuilder } from '../model/builders/user-team.builder';
import { UserService } from './user.service';

describe('User Service', () => {
  let service: UserService;

  const { angularFirestore, timeService } = SpiesBuilder.init()
    .withAngularFirestore()
    .withTimeService()
    .build();

  beforeEach(() => {
    service = new UserService(angularFirestore, timeService);
  });

  describe('Load User', () => {
    it('should return Observable of User, user without teams and without selected team id', fakeAsync(() => {
      const firebaseUser = UserTestBuilder.with('1', 'user 1').buildFirebaseUser();
      const expectedUser = UserTestBuilder.with(firebaseUser.id, firebaseUser.name)
        .withSelectedTeamId(null)
        .withUserTeam(null)
        .build();

      angularFirestore
        .collection()
        .doc()
        .valueChanges.and.returnValue(cold('x', { x: firebaseUser }));
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      const expected = cold('(x|)', { x: expectedUser });

      const result = service.loadUser(firebaseUser.id);

      expect(result).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'users');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, firebaseUser.id);
    }));

    it('should return Observable of User, user with teams and with selected team id', fakeAsync(() => {
      const now = new Date();
      const userTeams = [
        UserTeamBuilder.from('123', 'test name', now).build(),
        UserTeamBuilder.from('124', 'test name 2', now).build()
      ];
      const firebaseUser = UserTestBuilder.with('1', 'user 1')
        .withUserTeam(userTeams[0])
        .withUserTeam(userTeams[1])
        .withSelectedTeamId(userTeams[1].id)
        .buildFirebaseUser();
      const expectedUser = UserTestBuilder.with(firebaseUser.id, firebaseUser.name)
        .withSelectedTeamId(userTeams[1].id)
        .withUserTeam(userTeams[0])
        .withUserTeam(userTeams[1])
        .build();

      angularFirestore
        .collection()
        .doc()
        .valueChanges.and.returnValue(cold('x', { x: firebaseUser }));
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();
      timeService.Creation.fromFirebaseTimestamp.and.returnValue(now);

      const expected = cold('(x|)', { x: expectedUser });

      const result = service.loadUser(firebaseUser.id);

      expect(result).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'users');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, firebaseUser.id);
    }));
  });

  describe('Change Team', () => {
    beforeEach(() => {
      angularFirestore
        .collection()
        .doc()
        .update.calls.reset();
    });

    it('should set Selected Team Id field and Updated of this team', () => {
      const yestarday = DateTestBuilder.now()
        .addDays(-1)
        .build();
      const now = DateTestBuilder.now().build();
      const userTeams = [
        UserTeamBuilder.from('123', 'name 1', yestarday).build(),
        UserTeamBuilder.from('124', 'name 2', yestarday).build(),
        UserTeamBuilder.from('125', 'name 3', yestarday).build()
      ];
      const chosenTeam = userTeams[2];
      const expectedTeams = [
        UserTeamBuilder.from('123', 'name 1', yestarday).build(),
        UserTeamBuilder.from('124', 'name 2', yestarday).build(),
        UserTeamBuilder.from('125', 'name 3', now).build()
      ];

      const user = UserTestBuilder.with('1', 'user')
        .withSelectedTeamId(userTeams[0].id)
        .withUserTeams(userTeams)
        .build();

      angularFirestore
        .collection()
        .doc()
        .update.and.returnValue(Promise.resolve());
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      const request: ChangeTeamRequest = { teamId: chosenTeam.id, updated: now, user };

      const result = service.changeTeam(request);

      result.subscribe(actual => expect(actual).toEqual(request));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'users');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, user.id);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc().update, 1, {
        selectedTeamId: chosenTeam.id,
        teams: expectedTeams
      });
    });
  });
});
