import { of } from 'rxjs';
import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { adonaAuthErrorCodes } from 'src/app/modules/auth/constants/adona-auth-error-codes.constants';
import { authErrorMessages } from 'src/app/modules/auth/constants/auth-error-messages.constants';
import { ChangePasswordComponent } from 'src/app/modules/auth/pages/change-password/change-password.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Change Password Component', () => {
  let component: ChangePasswordComponent;

  const {
    routerFacade,
    registerFacade,
    unsubscriberService,
    apiRequestsFacade
  } = SpiesBuilder.init()
    .withApiRequestsFacade()
    .withRouterFacade()
    .withRegisterFacade()
    .withUnsubscriberService()
    .build();

  beforeEach(() => {
    component = new ChangePasswordComponent(routerFacade, registerFacade, unsubscriberService, apiRequestsFacade);

    registerFacade.confirmPasswordReset.calls.reset();
    routerFacade.selectRouteQueryParams.calls.reset();
    apiRequestsFacade.selectApiRequest.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('should make subscriptions', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of(null));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(null));

      component.ngOnInit();

      expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledTimes(1);
    });

    describe('Route Query Params subscription', () => {
      [null, { test: 'test' }, { oobCode: 'code' }].forEach((params) => {
        it(`should store oob code if query params is: ${JSON.stringify(params)}`, () => {
          apiRequestsFacade.selectApiRequest.and.returnValue(of(null));
          (component as any).confirmPasswordResetCode = null;
          routerFacade.selectRouteQueryParams.and.returnValue(of(params));

          component.ngOnInit();

          expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
          expect((component as any).confirmPasswordResetCode).toEqual(params && params.oobCode ? 'code' : null);
        });
      });
    });

    describe('Select Api Request subscription', () => {
      beforeEach(() => {
        routerFacade.selectRouteQueryParams.and.returnValue(of(null));
      });

      [
        ApiRequestStatusBuilder.start('1'),
        ApiRequestStatusBuilder.success('1'),
        ApiRequestStatusBuilder.fail('1', null),
        null
      ].forEach((request) => {
        it(`should unset error message when Api Request Status is: ${JSON.stringify(request)}`, () => {
          component.sessionExpired = true;
          component.errorMessage = 'test error';
          apiRequestsFacade.selectApiRequest.and.returnValue(of(request));

          component.ngOnInit();

          expect(component.apiRequestStatus).toEqual(request);
          expect(component.errorMessage).toEqual('');
          expect(component.sessionExpired).toBeFalse();
        });
      });

      it('should handle Weak Password error', () => {
        apiRequestsFacade.selectApiRequest.and.returnValue(
          of(ApiRequestStatusBuilder.fail('123', firebaseAuthErrorCodes.weakPassword))
        );
        component.sessionExpired = true;

        component.ngOnInit();

        expect(component.apiRequestStatus).toEqual(
          ApiRequestStatusBuilder.fail('123', firebaseAuthErrorCodes.weakPassword)
        );
        expect(component.errorMessage).toEqual(authErrorMessages[firebaseAuthErrorCodes.weakPassword]);
        expect(component.sessionExpired).toBeFalse();
      });

      [
        ApiRequestStatusBuilder.fail('123', firebaseAuthErrorCodes.oobCodeExpired),
        ApiRequestStatusBuilder.fail('123', firebaseAuthErrorCodes.oobCodeInvalid)
      ].forEach((request) => {
        it(`should handle ${request.errorCode} error`, () => {
          component.sessionExpired = false;
          apiRequestsFacade.selectApiRequest.and.returnValue(of(request));

          component.ngOnInit();

          expect(component.apiRequestStatus).toEqual(request);
          expect(component.errorMessage).toEqual(authErrorMessages[adonaAuthErrorCodes.invalidSession]);
          expect(component.sessionExpired).toBeTrue();
        });
      });
    });
  });

  describe('On Destroy', () => {
    it('should complete unsubscriber', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Change Password', () => {
    it('should not call facade is form is invalid', () => {
      component.form.get('password').setErrors({ error: { valid: false } });

      component.changePassword();

      expect(registerFacade.confirmPasswordReset).not.toHaveBeenCalled();
    });

    it('should call facade', () => {
      component.form.get('password').setValue('pass1');
      component.form.get('repeatPassword').setValue('pass1');
      (component as any).confirmPasswordResetCode = 'test';

      component.changePassword();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(registerFacade.confirmPasswordReset, 1, 'test', 'pass1');
    });
  });

  describe('Is Component Valid Usage', () => {
    it('should return true if code is set', () => {
      (component as any).confirmPasswordResetCode = 'test';

      expect(component.isComponentValidUsage()).toBeTrue();
    });

    [null, undefined, ''].forEach((code) => {
      it(`should return false if code is: ${code}`, () => {
        (component as any).confirmPasswordResetCode = code;

        expect(component.isComponentValidUsage()).toBeFalse();
      });
    });
  });

  describe('Should Show Form', () => {
    [
      { code: '123', request: ApiRequestStatusBuilder.start('1'), sessionExpired: false, expected: true },
      { code: '123', request: ApiRequestStatusBuilder.fail('1', 'test'), sessionExpired: false, expected: true },
      { code: '123', request: null, sessionExpired: false, expected: true },
      { code: null, request: null, sessionExpired: false, expected: false },
      { code: '123', request: ApiRequestStatusBuilder.success('1'), sessionExpired: false, expected: false },
      { code: '123', request: null, sessionExpired: true, expected: false }
    ].forEach((input) => {
      it(`should ${input.expected ? '' : 'not'} show form for data: ${JSON.stringify(input)}`, () => {
        (component as any).confirmPasswordResetCode = input.code;
        component.apiRequestStatus = input.request;
        component.sessionExpired = input.sessionExpired;

        const result = component.shouldShowForm();

        expect(result).toEqual(input.expected);
      });
    });
  });
});
