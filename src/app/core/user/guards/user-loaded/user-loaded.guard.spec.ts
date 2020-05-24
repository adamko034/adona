import { cold, hot } from 'jasmine-marbles';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { UserLoadedGuard } from './user-loaded.guard';

describe('User Loaded Guard', () => {
  it('should return true only when user is present', () => {
    const { userFacade } = SpiesBuilder.init().withUserFacade().build();
    const user = UserTestBuilder.withDefaultData().build();

    userFacade.selectUser.and.returnValue(hot('--a-b', { a: null, b: user }));
    const guard = new UserLoadedGuard(userFacade);

    const result = guard.canActivate();

    expect(result).toBeObservable(cold('----(b|)', { b: true }));
  });
});
