import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { registerActions } from 'src/app/modules/auth/store/actions/register.actions';
import { resetPasswordActions } from 'src/app/modules/auth/store/actions/reset-password.actions';
import { verifyEmailActions } from 'src/app/modules/auth/store/actions/verify-email.actions';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Register Facade', () => {
  let facade: RegisterFacade;
  let mockStore: MockStore<AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    mockStore = TestBed.inject(MockStore);
    facade = new RegisterFacade(mockStore);
  });

  describe('Send Email Verification Link', () => {
    it('should dispatch Send Email Verification Link Requested', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');
      facade.sendEmailVerificationLink();
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        verifyEmailActions.sendEmailVerificationLinkRequested()
      );
    });
  });

  describe('Confirm Email Verification Link', () => {
    it('should dispatch Confirm Email Requested action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');
      facade.confirmEmailVerification('123');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        verifyEmailActions.confirmEmailRequested({ code: '123' })
      );
    });
  });

  describe('Register', () => {
    it('should dispatch Register Requested action', () => {
      const dispathSpy = spyOn(mockStore, 'dispatch');
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();

      facade.register(credentials);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispathSpy,
        1,
        registerActions.registerRequested({ credentials })
      );
    });
  });

  describe('Confirm Password Reset', () => {
    it('should dispach Confirm Password Reset Requested action', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');
      facade.confirmPasswordReset('123', 'pass1');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        resetPasswordActions.confirmPasswordResetRequested({ oobCode: '123', newPassword: 'pass1' })
      );
    });
  });

  describe('Send Password Reset Email', () => {
    it('should dispatch Send Password Reset Link requested', () => {
      const dispatchSpy = spyOn(mockStore, 'dispatch');
      facade.sendPasswordResetEmail('user@example.com');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        resetPasswordActions.sendPasswordResetLinkRequested({ email: 'user@example.com' })
      );
    });
  });
});
