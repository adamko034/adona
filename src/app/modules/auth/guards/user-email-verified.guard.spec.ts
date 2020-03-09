import { cold } from 'jasmine-marbles';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { UserEmailVerifiedGuard } from './user-email-verified.guard';

describe('User Email Verified Guard', () => {
  let guard: UserEmailVerifiedGuard;
  const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();

  const { authService, navigationService } = SpiesBuilder.init()
    .withAuthService()
    .withNavigationService()
    .build();

  beforeEach(() => {
    guard = new UserEmailVerifiedGuard(authService, navigationService);

    authService.getAuthState.calls.reset();
  });

  describe('Can Activate', () => {
    it('should return true if auth state is set and user has not verifed their email', () => {
      const notVerfiedEmail = { ...firebaseUser, emailVerified: false };
      authService.getAuthState.and.returnValue(cold('--a', { a: notVerfiedEmail }));

      const result = guard.canActivate();

      expect(result).toBeObservable(cold('--b', { b: true }));
    });

    it('should return false if auth state is set and user has verifed their email', () => {
      authService.getAuthState.and.returnValue(cold('--a', { a: firebaseUser }));

      const result = guard.canActivate();

      expect(result).toBeObservable(cold('--b', { b: false }));
    });

    it('should return false if auth state is not set', () => {
      authService.getAuthState.and.returnValue(cold('--a', { a: null }));

      const result = guard.canActivate();

      expect(result).toBeObservable(cold('--b', { b: false }));
    });
  });
});
