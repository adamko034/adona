import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { verifyEmailActions } from 'src/app/modules/auth/store/actions/verify-email.actions';
import { VerifyEmailEffects } from 'src/app/modules/auth/store/effects/verify-email.effects';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Verify Email Effects', () => {
  let actions$: Actions;
  let effects: VerifyEmailEffects;

  const {
    apiRequestsFacade,
    authService,
    emailConfirmationService,
    errorEffectService
  } = SpiesBuilder.init()
    .withApiRequestsFacade()
    .withAuthService()
    .withEmailConfirmationService()
    .withErrorEffectService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);

    effects = new VerifyEmailEffects(
      actions$,
      apiRequestsFacade,
      authService,
      emailConfirmationService,
      errorEffectService
    );

    apiRequestsFacade.startRequest.calls.reset();
  });

  describe('Failure effects', () => {
    it('should create failure effects', () => {
      errorEffectService.createFrom.calls.reset();

      effects = new VerifyEmailEffects(
        actions$,
        apiRequestsFacade,
        authService,
        emailConfirmationService,
        errorEffectService
      );

      expect(errorEffectService.createFrom).toHaveBeenCalledTimes(2);
      expect(errorEffectService.createFrom).toHaveBeenCalledWith(
        actions$,
        verifyEmailActions.confirmEmailFailure,
        DefaultErrorType.ApiOther
      );
      expect(errorEffectService.createFrom).toHaveBeenCalledWith(
        actions$,
        verifyEmailActions.sendEmailVerificationLinkFailure,
        DefaultErrorType.ApiOther
      );
    });
  });

  describe('Confirm Email', () => {
    beforeEach(() => {
      authService.confirmEmail.calls.reset();
    });

    describe('Requested', () => {
      it('should start the request, confirm email and map to Confirm Email Success action', () => {
        actions$ = cold('--a--a', { a: verifyEmailActions.confirmEmailRequested({ code: '123' }) });
        authService.confirmEmail.and.returnValue(cold('a', { a: null }));

        expect(effects.confirmEmailRequested$).toBeObservable(
          cold('--b--b', { b: verifyEmailActions.confirmEmailSuccess() })
        );
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.confirmEmail, 2, '123');
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          apiRequestsFacade.startRequest,
          2,
          apiRequestIds.confirmEmailVerification
        );
      });

      it('should start the request and map to Confirm Email Failure if auth service fails', () => {
        actions$ = cold('--a--a', { a: verifyEmailActions.confirmEmailRequested({ code: '123' }) });
        authService.confirmEmail.and.returnValue(cold('#', null, { test: 500 }));

        expect(effects.confirmEmailRequested$).toBeObservable(
          cold('--b--b', {
            b: verifyEmailActions.confirmEmailFailure({
              error: ErrorBuilder.from()
                .withFirebaseError(apiRequestIds.confirmEmailVerification, undefined)
                .withErrorObject({ test: 500 })
                .build()
            })
          })
        );
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.confirmEmail, 2, '123');
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          apiRequestsFacade.startRequest,
          2,
          apiRequestIds.confirmEmailVerification
        );
      });
    });

    describe('Success', () => {
      it('should map to Request Success action', () => {
        actions$ = cold('aa', { a: verifyEmailActions.confirmEmailSuccess() });
        expect(effects.confirmEmailSuccess$).toBeObservable(
          cold('bb', { b: apiRequestActions.requestSuccess({ id: apiRequestIds.confirmEmailVerification }) })
        );
      });
    });
  });

  describe('Send Email Verification Link', () => {
    beforeEach(() => {
      emailConfirmationService.sendUsingAuthorizedUser.calls.reset();
    });

    describe('Requested', () => {
      it('should start the request, send email and map to Send Email Verification Link Success action', () => {
        actions$ = cold('--a--a', { a: verifyEmailActions.sendEmailVerificationLinkRequested() });
        emailConfirmationService.sendUsingAuthorizedUser.and.returnValue(cold('a', { a: null }));

        expect(effects.sendEmailVerificationLinkRequested$).toBeObservable(
          cold('--b--b', { b: verifyEmailActions.sendEmailVerificationLinkSuccess() })
        );
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.sendUsingAuthorizedUser, 2);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          apiRequestsFacade.startRequest,
          2,
          apiRequestIds.sendEmailVerificationLink
        );
      });

      it('should start the request and map to Confirm Email Failure if auth service fails', () => {
        actions$ = cold('--a--a', { a: verifyEmailActions.sendEmailVerificationLinkRequested() });
        emailConfirmationService.sendUsingAuthorizedUser.and.returnValue(cold('#', null, { test: 500 }));

        expect(effects.sendEmailVerificationLinkRequested$).toBeObservable(
          cold('--b--b', {
            b: verifyEmailActions.sendEmailVerificationLinkFailure({
              error: ErrorBuilder.from()
                .withFirebaseError(apiRequestIds.sendEmailVerificationLink, undefined)
                .withErrorObject({ test: 500 })
                .build()
            })
          })
        );
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.sendUsingAuthorizedUser, 2);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          apiRequestsFacade.startRequest,
          2,
          apiRequestIds.sendEmailVerificationLink
        );
      });
    });

    describe('Success', () => {
      it('should map to Request Success action', () => {
        actions$ = cold('aa', { a: verifyEmailActions.sendEmailVerificationLinkSuccess() });
        expect(effects.sendEmailVerificationLinkSuccess$).toBeObservable(
          cold('bb', { b: apiRequestActions.requestSuccess({ id: apiRequestIds.sendEmailVerificationLink }) })
        );
      });
    });
  });
});
