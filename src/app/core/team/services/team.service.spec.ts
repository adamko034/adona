import { fakeAsync, flush } from '@angular/core/testing';
import { of } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMembersBuilder } from 'src/app/core/team/model/team-member/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

describe('Team Service', () => {
  const { angularFirestore, timeService } = SpiesBuilder.init().withAngularFirestore().withTimeService().build();
  const user = UserTestBuilder.withDefaultData().build();

  let service: TeamService;

  beforeEach(() => {
    service = new TeamService(angularFirestore, timeService);
  });

  describe('Add Team', () => {
    let request: NewTeamRequest;
    let expectedTeam: Team;

    beforeEach(fakeAsync(() => {
      request = {
        created: new Date(),
        createdBy: user.name,
        name: 'team name',
        members: TeamMembersBuilder.from().withMember(user.name, 'photourl').build()
      };

      expectedTeam = TeamBuilder.from('123', request.created, request.createdBy, request.name)
        .withMembers(request.members)
        .build();

      angularFirestore.createId.and.returnValue(expectedTeam.id);
      angularFirestore.firestore.batch().set.calls.reset();
      angularFirestore.firestore.batch().update.calls.reset();
      angularFirestore.firestore.batch().commit.calls.reset();
      angularFirestore.firestore.collection().doc.calls.reset();
      angularFirestore.firestore.collection.calls.reset();
    }));

    it('should use firestore batch to set new team and update users teams', fakeAsync(() => {
      angularFirestore.firestore.batch().commit.and.returnValue(Promise.resolve());
      angularFirestore.firestore.batch.calls.reset();

      const result = service.addTeam(request, user.id);
      flush();

      result.subscribe((team) => expect(team).toEqual(expectedTeam));
      expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().set).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().update).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().commit).toHaveBeenCalledTimes(1);

      expect(angularFirestore.firestore.collection).toHaveBeenCalledTimes(2);
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('teams');
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('users');

      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledTimes(2);
      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledWith(expectedTeam.id);
      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledWith(user.id);
    }));

    it('should return error if firebase batch fails', fakeAsync(() => {
      angularFirestore.firestore.batch().commit.and.returnValue(Promise.reject('this is error'));
      angularFirestore.firestore.batch.calls.reset();

      const result = service.addTeam(request, user.id);
      flush();

      result.subscribe({ error: (err) => expect(err).toEqual('this is error') });
      expect(angularFirestore.firestore.batch).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().set).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().update).toHaveBeenCalledTimes(1);
      expect(angularFirestore.firestore.batch().commit).toHaveBeenCalledTimes(1);

      expect(angularFirestore.firestore.collection).toHaveBeenCalledTimes(2);
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('teams');
      expect(angularFirestore.firestore.collection).toHaveBeenCalledWith('users');

      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledTimes(2);
      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledWith(expectedTeam.id);
      expect(angularFirestore.firestore.collection().doc).toHaveBeenCalledWith(user.id);
    }));
  });

  describe('Load Team', () => {
    let expectedTeam: Team;
    beforeEach(fakeAsync(() => {
      expectedTeam = TeamBuilder.from('123', new Date(), 'test user', 'test team')
        .withMembers(TeamMembersBuilder.from().withMember(user.name, 'photourl').build())
        .build();
    }));

    it('should load team from firebase', fakeAsync(() => {
      angularFirestore
        .collection()
        .doc()
        .valueChanges.and.returnValue(
          of({
            ...expectedTeam
          })
        );

      timeService.Creation.fromFirebaseTimestamp.and.returnValue(expectedTeam.created);
      angularFirestore.collection().doc.calls.reset();
      angularFirestore.collection.calls.reset();

      const result = service.loadTeam(expectedTeam.id);

      result.subscribe((team) => expect(team).toEqual(expectedTeam));
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('teams');
      expect(angularFirestore.collection().doc).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection().doc).toHaveBeenCalledWith(expectedTeam.id);
      expect(timeService.Creation.fromFirebaseTimestamp).toHaveBeenCalledTimes(1);
    }));
  });
});
