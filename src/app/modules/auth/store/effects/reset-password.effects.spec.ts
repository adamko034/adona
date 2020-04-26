import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { Error } from 'src/app/core/error/model/error.model';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { resetPasswordActions } from 'src/app/modules/auth/store/actions/reset-password.actions';
import { ResetPasswordEffects } from 'src/app/modules/auth/store/effects/reset-password.effects';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Reset Password Effects', () => {
  let effects: ResetPasswordEffects;
  let actions$: Actions;
  const email = 'user@example.com';

  const {
    apiRequestsFacade,
    authService,
    errorEffectService
  } = SpiesBuilder.init().withApiRequestsFacade().withAuthService().withErrorEffectService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });
    actions$ = TestBed.inject(Actions);

    effects = new ResetPasswordEffects(actions$, apiRequestsFacade, authService, errorEffectService);

    apiRequestsFacade.startRequest.calls.reset();
  });

  describe('Send Password Reset Link Requested', () => {
    beforeEach(() => {
      authService.sendPasswordResetEmail.calls.reset();
    });

    it('should start the request, send password reset link and map to Send Password Reset Link Success action', () => {
      actions$ = cold('--a', { a: resetPasswordActions.sendPasswordResetLinkRequested({ email }) });
      authService.sendPasswordResetEmail.and.returnValue(cold('a', { a: null }));

      expect(effects.sendPasswordResetLinkRequested$).toBeObservable(
        cold('--b', { b: resetPasswordActions.sendPasswordResetLinkSuccess() })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.sendPasswordResetEmail, 1, email);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.startRequest,
        1,
        apiRequestIds.sendPasswordResetLink
      );
    });

    it('should start the request and map to Send Password Reset Link Failure when auth service fails', () => {
      const err = { code: 'test', message: 'test message' };
      const expectedError: Error = { id: apiRequestIds.sendPasswordResetLink, code: 'test', errorObj: err };
      actions$ = cold('--a-a', { a: resetPasswordActions.sendPasswordResetLinkRequested({ email }) });
      authService.sendPasswordResetEmail.and.returnValue(cold('#', null, err));

      expect(effects.sendPasswordResetLinkRequested$).toBeObservable(
        cold('--b-b', { b: resetPasswordActions.sendPasswordResetLinkFailure({ error: expectedError }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.sendPasswordResetEmail, 2, email);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.startRequest,
        2,
        apiRequestIds.sendPasswordResetLink
      );
    });
  });

  describe('Send Password Reset Link Success', () => {
    it('should success the request', () => {
      actions$ = cold('-a', { a: resetPasswordActions.sendPasswordResetLinkSuccess() });
      expect(effects.sendPasswordResetLinkSuccess$).toBeObservable(
        cold('-b', { b: apiRequestActions.requestSuccess({ id: apiRequestIds.sendPasswordResetLink }) })
      );
    });
  });

  describe('Failures actions', () => {
    it('should create using Error Effects Service', () => {
      errorEffectService.createFrom.calls.reset();

      effects = new ResetPasswordEffects(actions$, apiRequestsFacade, authService, errorEffectService);

      expect(errorEffectService.createFrom).toHaveBeenCalledTimes(2);
      expect(errorEffectService.createFrom).toHaveBeenCalledWith(
        actions$,
        resetPasswordActions.sendPasswordResetLinkFailure,
        DefaultErrorType.ApiOther
      );
      expect(errorEffectService.createFrom).toHaveBeenCalledWith(
        actions$,
        resetPasswordActions.confirmPasswordResetFailure,
        DefaultErrorType.ApiOther
      );
    });
  });

  describe('Confirm Password Reset Requested', () => {
    beforeEach(() => {
      authService.confirmPasswordReset.calls.reset();
    });

    it('should start the request, confirm password reset and map to Confirm Password Reset Success', () => {
      authService.confirmPasswordReset.and.returnValue(cold('a', { a: null }));
      actions$ = cold('--a--a', {
        a: resetPasswordActions.confirmPasswordResetRequested({ oobCode: '123', newPassword: 'newPass' })
      });

      expect(effects.confirmPasswordResetRequested$).toBeObservable(
        cold('--b--b', { b: resetPasswordActions.confirmPasswordResetSuccess() })
      );

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.startRequest,
        2,
        apiRequestIds.confirmPasswordResetLink
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.confirmPasswordReset, 2, '123', 'newPass');
    });

    it('should start the request and map to Confirm Password Reset Failure action if auth service fails', () => {
      authService.confirmPasswordReset.and.returnValue(cold('#', null, { test: 500 }));
      actions$ = cold('--a--a', {
        a: resetPasswordActions.confirmPasswordResetRequested({ oobCode: '123', newPassword: 'newPass' })
      });

      const expectedError: Error = {
        code: undefined,
        id: apiRequestIds.confirmPasswordResetLink,
        errorObj: { test: 500 }
      };

      expect(effects.confirmPasswordResetRequested$).toBeObservable(
        cold('--b--b', { b: resetPasswordActions.confirmPasswordResetFailure({ error: expectedError }) })
      );

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.startRequest,
        2,
        apiRequestIds.confirmPasswordResetLink
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.confirmPasswordReset, 2, '123', 'newPass');
    });
  });

  describe('Confirm Password Reset Success', () => {
    it('should success the request', () => {
      actions$ = cold('---a', { a: resetPasswordActions.confirmPasswordResetSuccess() });
      expect(effects.confirmPasswordResetSuccess$).toBeObservable(
        cold('---b', { b: apiRequestActions.requestSuccess({ id: apiRequestIds.confirmPasswordResetLink }) })
      );
    });
  });
});
