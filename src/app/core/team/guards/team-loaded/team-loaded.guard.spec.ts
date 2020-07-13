import { cold } from 'jasmine-marbles';
import { TeamLoadedGuard } from 'src/app/core/team/guards/team-loaded/team-loaded.guard';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Selected Team Loaded Guard', () => {
  let guard: TeamLoadedGuard;

  const { userFacade, teamFacade } = SpiesBuilder.init().withUserFacade().withTeamFacade().build();

  beforeEach(() => {
    guard = new TeamLoadedGuard(userFacade, teamFacade);
  });

  describe('Can Activate', () => {
    it('should wait for user, load selected team and wait for it', () => {
      const user = UserTestBuilder.withDefaultData().build();
      const team = TeamBuilder.from('123', new Date(), user.name, 'team 123', []).build();

      teamFacade.loadTeam.and.returnValue(null);
      userFacade.selectUser.and.returnValue(cold('n-a', { n: null, a: user }));
      teamFacade.selectSelectedTeam.and.returnValue(cold('----nb', { n: undefined, b: team }));

      expect(guard.canActivate()).toBeObservable(cold('-------(c|)', { c: true }));
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectSelectedTeam).toHaveBeenCalledTimes(1);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.loadTeam, 1, user.selectedTeamId);
    });
  });
});
