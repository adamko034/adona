import { cold } from 'jasmine-marbles';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';
import { registrationErrorCodes } from 'src/app/modules/auth/constants/registration-error-messages.constants';
import { RegistrationFacade } from 'src/app/modules/auth/facade/registration-facade';
import { RegistrationErrorBuilder } from 'src/app/modules/auth/models/registration/registration-error.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Registration Facade', () => {
  let facade: RegistrationFacade;

  const {
    authService,
    userService,
    registrationErrorService,
    emailConfirmationService,
    resetPasswordService
  } = SpiesBuilder.init()
    .withAuthService()
    .withUserService()
    .withRegistrationErrorService()
    .withEmailConfirmationService()
    .withResetPasswordService()
    .build();

  beforeEach(() => {
    facade = new RegistrationFacade(
      authService,
      userService,
      registrationErrorService,
      emailConfirmationService,
      resetPasswordService
    );

    registrationErrorService.push.calls.reset();
  });

  describe('Resend Email Confirmation Link', () => {
    it('should call service', () => {
      facade.resendEmailConfirmationLink();

      expect(emailConfirmationService.sendUsingAuthorizedUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('Select Registration Error', () => {
    it('should call service and emit only when value changed', () => {
      const error1 = RegistrationErrorBuilder.from('1', 'first error').build();
      const error2 = RegistrationErrorBuilder.from('2', 'second error').build();
      const nullError = null;

      registrationErrorService.selectErrors.and.returnValue(
        cold('--aaababbca', { a: error1, b: error2, c: nullError })
      );

      expect(facade.selectRegistrationError()).toBeObservable(
        cold('--a--bab-ca', { a: error1, b: error2, c: nullError })
      );
      expect(registrationErrorService.selectErrors).toHaveBeenCalledTimes(1);
    });
  });

  describe('Push Form Invalid Error', () => {
    it('should call service', () => {
      facade.pushFormInvalidError();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        registrationErrorService.push,
        1,
        registrationErrorCodes.formInvalid
      );
    });
  });

  describe('Clear Registration Error', () => {
    it('should push null', () => {
      facade.clearRegistrationErrors();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationErrorService.push, 1, null);
    });
  });

  describe('Register', () => {
    const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();
    const credentials = CredentialsBuilder.from(firebaseUser.email, 'test').build();
    const user = UserBuilder.from(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName)
      .withDefaultPhotoUrl()
      .build();

    beforeEach(() => {
      authService.register.calls.reset();
      userService.createUser.calls.reset();
      emailConfirmationService.send.calls.reset();
      registrationErrorService.push.calls.reset();
    });

    it('should register, create user and send email confirmation link', () => {
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('a', { a: null }));

      const result = facade.register(credentials);

      expect(result).toBeObservable(cold('a', { a: true }));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 1, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 1, user);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 1, firebaseUser);
    });

    it('should push unkown error', () => {
      authService.register.and.returnValue(cold('#', null, { invalidCode: 'test' }));

      let result = facade.register(credentials);
      expect(result).toBeObservable(cold('(a|)', { a: false }));

      // success
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('a', { a: null }));

      result = facade.register(credentials);
      expect(result).toBeObservable(cold('a', { a: true }));
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationErrorService.push, 1, registrationErrorCodes.unknown);
    });

    describe('Error - Success journeys', () => {
      it('shoud return false when auth service fails', () => {
        authService.register.and.returnValue(cold('#', null, { code: 'test' }));

        let result = facade.register(credentials);
        expect(result).toBeObservable(cold('(a|)', { a: false }));

        // success
        authService.register.and.returnValue(cold('a', { a: firebaseUser }));
        userService.createUser.and.returnValue(cold('a', { a: null }));
        emailConfirmationService.send.and.returnValue(cold('a', { a: null }));

        result = facade.register(credentials);
        expect(result).toBeObservable(cold('a', { a: true }));
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationErrorService.push, 1, 'test');
      });

      it('should return false when user service fails', () => {
        authService.register.and.returnValue(cold('a', { a: firebaseUser }));
        userService.createUser.and.returnValue(cold('#', null, { code: 'test' }));

        let result = facade.register(credentials);
        expect(result).toBeObservable(cold('(a|)', { a: false }));

        // success
        authService.register.and.returnValue(cold('a', { a: firebaseUser }));
        userService.createUser.and.returnValue(cold('a', { a: null }));
        emailConfirmationService.send.and.returnValue(cold('a', { a: null }));

        result = facade.register(credentials);
        expect(result).toBeObservable(cold('a', { a: true }));
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationErrorService.push, 1, 'test');
      });

      it('should return false when email confirmation service fails', () => {
        authService.register.and.returnValue(cold('a', { a: firebaseUser }));
        userService.createUser.and.returnValue(cold('a', { a: null }));
        emailConfirmationService.send.and.returnValue(cold('#', null, { code: 'test' }));

        let result = facade.register(credentials);
        expect(result).toBeObservable(cold('(a|)', { a: false }));

        // success
        authService.register.and.returnValue(cold('a', { a: firebaseUser }));
        userService.createUser.and.returnValue(cold('a', { a: null }));
        emailConfirmationService.send.and.returnValue(cold('a', { a: null }));

        result = facade.register(credentials);
        expect(result).toBeObservable(cold('a', { a: true }));
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationErrorService.push, 1, 'test');
      });
    });
  });

  describe('Confirm Password Reset', () => {
    it('should call service', () => {
      facade.confirmPasswordReset('code1', 'newPassword123');

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        resetPasswordService.confirmPasswordReset,
        1,
        'code1',
        'newPassword123'
      );
    });
  });

  describe('Send Password Reset Email', () => {
    it('should call service', () => {
      facade.sendPasswordResetEmail('user@example.com');

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        resetPasswordService.sendPasswordResetEmail,
        1,
        'user@example.com'
      );
    });
  });
});
