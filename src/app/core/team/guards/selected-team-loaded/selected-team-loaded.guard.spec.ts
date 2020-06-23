import { cold } from 'jasmine-marbles';
import { SelectedTeamLoadedGuard } from 'src/app/core/team/guards/selected-team-loaded/selected-team-loaded.guard';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Selected Team Loaded Guard', () => {
  let guard: SelectedTeamLoadedGuard;

  const { userFacade, teamFacade } = SpiesBuilder.init().withUserFacade().withTeamFacade().build();

  beforeEach(() => {
    guard = new SelectedTeamLoadedGuard(userFacade, teamFacade);
  });

  describe('Can Activate', () => {
    it('should wait for user, load selected team and wait for it', () => {
      const user = UserTestBuilder.withDefaultData().build();
      const team = TeamBuilder.from('123', new Date(), user.name, 'team 123').build();

      userFacade.selectUser.and.returnValue(cold('--a', { a: user }));
      teamFacade.selectSelectedTeam.and.returnValue(cold('-----b', { b: team }));

      expect(guard.canActivate()).toBeObservable(cold('-----(c|)', { c: true }));
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(teamFacade.selectSelectedTeam).toHaveBeenCalledTimes(1);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.loadSelectedTeam, 1, user.selectedTeamId);
    });
  });
});
