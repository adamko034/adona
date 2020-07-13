import { cold } from 'jasmine-marbles';
import { HandleUserInvitationGuard } from 'src/app/core/user/guards/user-has-invitation/handle-user-invitation.guard';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('User Has Invitation Guard', () => {
  let guard: HandleUserInvitationGuard;
  const { userFacade } = SpiesBuilder.init().withUserFacade().build();

  beforeEach(() => {
    guard = new HandleUserInvitationGuard(userFacade);

    userFacade.selectUser.calls.reset();
    userFacade.handleInvitation.calls.reset();
  });

  describe('Can Activate', () => {
    it('should wait for user and team and then handle invitation', () => {
      const user = UserTestBuilder.withDefaultData().withInvitationId('123').build();

      userFacade.selectUser.and.returnValue(cold('----a', { a: user }));

      expect(guard.canActivate()).toBeObservable(cold('----a', { a: true }));
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.handleInvitation, 1, user);
    });

    it('should wait for user and team and then not handle invitation when id not set', () => {
      const user = UserTestBuilder.withDefaultData().withInvitationId(null).build();
      userFacade.selectUser.and.returnValue(cold('----a', { a: user }));

      expect(guard.canActivate()).toBeObservable(cold('----a', { a: true }));
      expect(userFacade.selectUser).toHaveBeenCalledTimes(1);
      expect(userFacade.handleInvitation).not.toHaveBeenCalled();
    });
  });
});
