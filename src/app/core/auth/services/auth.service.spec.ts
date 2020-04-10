import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const firebaseUserCredential = {
    user: UserTestBuilder.withDefaultData().buildFirebaseUser()
  };

  let authService: AuthService;
  const fireAuthSpy: any = {
    auth: jasmine.createSpyObj('auth', {
      applyActionCode: Promise.resolve(),
      signInWithEmailAndPassword: Promise.resolve({}),
      signOut: Promise.resolve(),
      createUserWithEmailAndPassword: Promise.resolve(firebaseUserCredential),
      sendPasswordResetEmail: Promise.resolve(),
      confirmPasswordReset: Promise.resolve()
    })
  };
  const { userUtilsService } = SpiesBuilder.init().withUserUtilsService().build();

  beforeEach(() => {
    authService = new AuthService(fireAuthSpy, userUtilsService);
  });

  describe('Login', () => {
    it('should call fireauth service login method', () => {
      const credentials = { email: 'adam', password: 'test' };

      authService.login(credentials);

      expect(fireAuthSpy.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(credentials.email, credentials.password);
    });
  });

  describe('Logout', () => {
    it('should call fireauth service logout method', () => {
      authService.logout();
      expect(fireAuthSpy.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      userUtilsService.extractUsernameFromEmail.calls.reset();
    });

    it('should register in firebase and return Firebase User', (done) => {
      const credentials = CredentialsBuilder.from(firebaseUserCredential.user.email, '123').build();
      userUtilsService.extractUsernameFromEmail.and.returnValue(firebaseUserCredential.user.email.split('@')[0]);
      firebaseUserCredential.user.updateProfile.and.returnValue(Promise.resolve());

      authService.register(credentials).subscribe((resData) => {
        expect(resData).toEqual(firebaseUserCredential.user);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          fireAuthSpy.auth.createUserWithEmailAndPassword,
          1,
          credentials.email,
          credentials.password
        );

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(firebaseUserCredential.user.updateProfile, 1, {
          displayName: firebaseUserCredential.user.displayName
        });

        done();
      });
    });
  });

  describe('Send Password Reset Email', () => {
    it('should send firebase auth email', () => {
      authService.sendPasswordResetEmail('example@ex.com').subscribe();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(fireAuthSpy.auth.sendPasswordResetEmail, 1, 'example@ex.com');
    });
  });

  describe('Confirm Password Reset', () => {
    it('should call confirm password reset using firebase auth', () => {
      authService.confirmPasswordReset('123', 'newPassword');

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(fireAuthSpy.auth.confirmPasswordReset, 1, '123', 'newPassword');
    });
  });

  describe('Confirm Email', () => {
    it('should call Apply Action Code from firebase auth', () => {
      authService.confirmEmail('123');

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(fireAuthSpy.auth.applyActionCode, 1, '123');
    });
  });
});
