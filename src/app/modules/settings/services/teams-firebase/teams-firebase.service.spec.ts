import { of } from 'rxjs';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { TeamsFirebaseService } from 'src/app/modules/settings/services/teams-firebase/teams-firebase.service';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Teams Firebase Service', () => {
  let service: TeamsFirebaseService;

  const {
    angularFireFunctions,
    teamFactory
  } = SpiesBuilder.init().withAngularFireFunctions().withTeamFactory().build();

  beforeEach(() => {
    service = new TeamsFirebaseService(angularFireFunctions, teamFactory);

    angularFireFunctions.httpsCallable.calls.reset();
    teamFactory.listFromFirebase.calls.reset();
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
});
