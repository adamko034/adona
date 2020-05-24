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
    it('should call facade if user is present and has invitaion id set. Should complete the observable', () => {
      const user = UserTestBuilder.withDefaultData().withInvitationId('123').build();
      userFacade.selectUser.and.returnValue(cold('--a--b', { a: null, b: user }));

      expect(guard.canActivate(null, null)).toBeObservable(cold('-----(a|)', { a: true }));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userFacade.handleInvitation, 1, '123');
    });

    it('should not call facade if user is present but without invitaion id set. Should complete the observable', () => {
      const user = UserTestBuilder.withDefaultData().build();
      userFacade.selectUser.and.returnValue(cold('--a--b', { a: null, b: user }));

      expect(guard.canActivate(null, null)).toBeObservable(cold('-----(b|)', { b: true }));
      expect(userFacade.handleInvitation).not.toHaveBeenCalled();
    });
  });
});
