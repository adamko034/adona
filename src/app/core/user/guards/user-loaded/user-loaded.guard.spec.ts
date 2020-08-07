import { cold } from 'jasmine-marbles';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { UserLoadedGuard } from './user-loaded.guard';

describe('User Loaded Guard', () => {
  it('should return true only when user is present', () => {
    const { userFacade, teamFacade } = SpiesBuilder.init().withUserFacade().withTeamFacade().build();
    const user = UserTestBuilder.withDefaultData().build();

    userFacade.selectUser.and.returnValue(cold('--a-b', { a: null, b: user }));
    const guard = new UserLoadedGuard(userFacade, teamFacade);

    const result = guard.canActivate();

    expect(result).toBeObservable(cold('----(b|)', { b: true }));
    expect(teamFacade.loadSelectedTeam).toHaveBeenCalledTimes(1);
    expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
  });
});
