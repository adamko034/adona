import { fakeAsync, flush } from '@angular/core/testing';
import { of } from 'rxjs';
import { NewTeamMemberBuilder } from 'src/app/core/team/model/requests/new-team/new-team-member.builder';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { firebaseConstants } from 'src/app/shared/constants/firebase/firebase-functions.constant';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Team Service', () => {
  const {
    angularFirestore,
    angularFireFunctions,
    teamFactory
  } = SpiesBuilder.init().withTeamFactory().withAngularFirestore().withAngularFireFunctions().build();
  const user = UserTestBuilder.withDefaultData().withDefaultUserTeams(2).build();

  let service: TeamService;

  beforeEach(() => {
    service = new TeamService(angularFirestore, angularFireFunctions, teamFactory);

    angularFireFunctions.httpsCallable.calls.reset();
    teamFactory.listFromFirebase.calls.reset();
  });

  describe('Add Team', () => {
    let request: NewTeamRequest;
    let expectedTeam: Team;

    beforeEach(fakeAsync(() => {
      request = {
        created: new Date(),
        name: 'team name',
        members: [
          NewTeamMemberBuilder.from('test 1').build(),
          NewTeamMemberBuilder.from('test 2').build(),
          NewTeamMemberBuilder.from('with email').withEmail('email').build(),
          ,
          NewTeamMemberBuilder.from('with email 2').withEmail('email2').build()
        ]
      };

      expectedTeam = TeamBuilder.from(
        '123',
        request.created,
        user.id,
        request.name,
        request.members.map((m) => ({ name: m.name, photoUrl: 'url' }))
      ).build();

      angularFirestore.firestore.batch().commit.and.returnValue(Promise.resolve());
      angularFirestore.createId.and.returnValue(expectedTeam.id);

      angularFirestore.firestore.batch().set.calls.reset();
      angularFirestore.firestore.batch().update.calls.reset();
      angularFirestore.firestore.batch().commit.calls.reset();
      angularFirestore.firestore.collection().doc.calls.reset();
      angularFirestore.firestore.collection.calls.reset();
    }));

    it('should use firestore batch to set new team', fakeAsync(() => {
      angularFirestore.firestore.batch.calls.reset();

      const result = service.addTeam(user, request);
      flush();

      result.subscribe((teamId) => expect(teamId).toEqual(expectedTeam.id));

      expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().set).toHaveBeenCalledTimes(4);
      expect(angularFirestore.firestore.batch().update).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().commit).toHaveBeenCalledTimes(1);

      expect(angularFirestore.firestore.collection).toHaveBeenCalledTimes(5);
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('virtualUsers');
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('virtualUsers');
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('teams');
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('teamMembers');
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('users');

      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledTimes(5);
    }));

    it('should return error if firebase batch fails', fakeAsync(() => {
      const result = service.addTeam(user, request);
      flush();

      result.subscribe({ error: (err) => expect(err).toEqual('this is error') });
    }));
  });

  describe('Get Team', () => {
    let expectedTeam: Team;
    beforeEach(fakeAsync(() => {
      const members = [
        TeamMemberBuilder.from('test', 'photoUrl').build(),
        TeamMemberBuilder.from('test 2', 'url').build()
      ];
      expectedTeam = TeamBuilder.from('123', new Date(), 'test user', 'test team', members).build();
    }));

    it('should call angular fire function', (done) => {
      const callable = (data: any) => of({ i: 'test' });
      angularFireFunctions.httpsCallable.and.returnValue(callable);
      teamFactory.singleFromFirebase.and.returnValue(expectedTeam);

      service.getTeam('1').subscribe((team) => {
        expect(team).toEqual(expectedTeam);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          angularFireFunctions.httpsCallable,
          1,
          firebaseConstants.functions.team.get
        );
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFactory.singleFromFirebase, 1, { i: 'test' });
        done();
      });
    });
  });

  describe('Get All', () => {
    it('should call function and return array of teams', (done) => {
      const teams = [
        TeamBuilder.from('1', new Date(), 'test user', 'test team', [{ name: 'test user', photoUrl: 'url' }]).build()
      ];
      const callable = () => of(teams);
      angularFireFunctions.httpsCallable.and.returnValue(callable);
      teamFactory.listFromFirebase.and.returnValue(teams);

      service.getAll().subscribe((actual) => {
        expect(actual).toEqual(teams);
        expect(teamFactory.listFromFirebase).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('Update Name', () => {
    it('should update firebase', (done) => {
      angularFirestore.collection().doc().update.and.returnValue(of(undefined));

      angularFirestore.collection().doc().update.calls.reset();
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      service.updateName('1', 'new name').subscribe(() => {
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'teams');
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, '1');
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc().update, 1, {
          name: 'new name'
        });

        done();
      });
    });
  });

  describe('Delete Team', () => {
    it('should remove from firebase', (done) => {
      angularFirestore.collection().doc().delete.and.returnValue(of(undefined));

      angularFirestore.collection().doc().update.calls.reset();
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      service.delete('1').subscribe(() => {
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection, 1, 'teams');
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc, 1, '1');
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(angularFirestore.collection().doc().delete, 1);

        done();
      });
    });
  });
});
