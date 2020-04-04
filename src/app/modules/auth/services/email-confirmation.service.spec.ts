import { cold } from 'jasmine-marbles';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { EmailConfirmationService } from './email-confirmation.service';

describe('Email Confirmation Service', () => {
  let service: EmailConfirmationService;

  const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();
  const { authService } = SpiesBuilder.init()
    .withAuthService()
    .build();

  beforeEach(() => {
    service = new EmailConfirmationService(authService);

    firebaseUser.sendEmailVerification.calls.reset();
  });

  describe('Send Using Authorized User', () => {
    beforeEach(() => {
      authService.getAuthState.calls.reset();
    });

    it('should send email if auth state is set', () => {
      authService.getAuthState.and.returnValue(cold('--a', { a: firebaseUser }));
      firebaseUser.sendEmailVerification.and.returnValue(Promise.resolve());

      expect(service.sendUsingAuthorizedUser()).toBeObservable(cold('---'));
      expect(firebaseUser.sendEmailVerification).toHaveBeenCalledTimes(1);
    });

    it('should throw error if auth state is not set', () => {
      authService.getAuthState.and.returnValue(cold('--b', { b: null }));
      firebaseUser.sendEmailVerification.and.returnValue(Promise.resolve());

      expect(service.sendUsingAuthorizedUser()).toBeObservable(cold('--#', null, new Error('Auth not set')));
      expect(firebaseUser.sendEmailVerification).not.toHaveBeenCalled();
    });
  });

  describe('Send', () => {
    it('should send if firebase user is provided', () => {
      firebaseUser.sendEmailVerification.and.returnValue(Promise.resolve());

      expect(service.send(firebaseUser)).toBeObservable(cold('---'));
      expect(firebaseUser.sendEmailVerification).toHaveBeenCalledTimes(1);
    });

    it('should throw error if firebase user is not provided', () => {
      expect(service.send(null)).toBeObservable(cold('#', null, new Error('Auth not set')));
      expect(firebaseUser.sendEmailVerification).not.toHaveBeenCalled();
    });
  });
});
