import { cold } from 'jasmine-marbles';
import { ApiRequestStateBuilder } from 'src/app/core/gui/model/backend-state/api-request-state.builder';
import { ResetPasswordService } from 'src/app/modules/auth/services/reset-password/reset-password.service';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Reset Password Service', () => {
  let service: ResetPasswordService;

  const { authService } = SpiesBuilder.init().withAuthService().build();
  const email = 'test@example.com';

  beforeEach(() => {
    service = new ResetPasswordService(authService);

    authService.sendPasswordResetEmail.calls.reset();
  });

  describe('Reset password', () => {
    it('should reset password', () => {
      authService.sendPasswordResetEmail.and.returnValue(cold('aaa', { a: null }));

      expect(service.sendPasswordResetEmail(email)).toBeObservable(
        cold('(a|)', { a: ApiRequestStateBuilder.success() })
      );
      expect(authService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });

    it('should not reset password if auth service fails', () => {
      authService.sendPasswordResetEmail.and.returnValue(cold('---#', null, { code: 'auth/user-not-found' }));

      expect(service.sendPasswordResetEmail(email)).toBeObservable(
        cold('---(a|)', { a: ApiRequestStateBuilder.fail('auth/user-not-found') })
      );
      expect(authService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });
  });
});
