import { cold } from 'jasmine-marbles';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { TeamBuilder } from '../model/builders/team.builder';
import { NewTeamRequest } from '../model/new-team-request.model';
import { TeamService } from './team.service';

fdescribe('Team Service', () => {
  const { angularFirestore, timeService } = SpiesBuilder.init()
    .withAngularFirestore()
    .withTimeService()
    .build();
  const user = UserTestBuilder.withDefaultData().build();

  let service: TeamService;

  beforeEach(() => {
    service = new TeamService(angularFirestore, timeService);
  });

  describe('Add Team', () => {
    it('should use firestore batch to set new team and update users teams', () => {
      const request: NewTeamRequest = {
        created: new Date(),
        createdBy: user.name,
        name: 'team name'
      };

      const expectedTeam = TeamBuilder.from('123', request.created, request.createdBy, name).build();
      angularFirestore.createId.and.returnValue(expectedTeam.id);

      const expected = cold('x', { x: expectedTeam });

      const result = service.addTeam(request, user.id);

      expect(result).toBeObservable(expected);
    });
  });
});
