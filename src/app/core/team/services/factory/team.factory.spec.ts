import { TeamDto } from 'src/app/core/team/model/team/team-dto.model';
import { TeamFactory } from 'src/app/core/team/services/factory/team.factory';
import { resources } from 'src/app/shared/resources/resources';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Team Factory', () => {
  const mockDate = new Date();
  let factory: TeamFactory;

  const { timeService } = SpiesBuilder.init().withTimeService().build();

  beforeAll(() => {
    jasmine.clock().mockDate(mockDate);
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    factory = new TeamFactory(timeService);
  });

  describe('Personal Team DTO', () => {
    it('should created Team Dto for Personal team', () => {
      const expected: TeamDto = { created: mockDate, createdByUid: '123', name: resources.team.personalTeamName };
      expect(factory.personalTeamDto('123')).toEqual(expected);
    });
  });

  describe('From Firebase Team', () => {
    it('should create from firebase object', () => {
      timeService.Creation.fromFirebaseTimestamp.and.returnValue(mockDate);
      const members = [{ name: 'testuser', photoUrl: 'testUrl' }];
      const firebaseTeam = {
        id: '1',
        createdBy: 'testUser',
        name: 'test team',
        created: { seconds: '1' },
        members
      };

      expect(factory.fromFirebase(firebaseTeam)).toEqual({
        id: firebaseTeam.id,
        created: mockDate,
        createdBy: firebaseTeam.createdBy,
        name: firebaseTeam.name,
        members
      });

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(timeService.Creation.fromFirebaseTimestamp, 1, { seconds: '1' });
    });
  });
});
