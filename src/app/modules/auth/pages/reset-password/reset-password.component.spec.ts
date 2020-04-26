import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { ResetPasswordComponent } from 'src/app/modules/auth/pages/reset-password/reset-password.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Reset Password Component', () => {
  let component: ResetPasswordComponent;

  const {
    registerFacade,
    routerFacade,
    unsubscriberService,
    apiRequestsFacade
  } = SpiesBuilder.init()
    .withRouterFacade()
    .withRegisterFacade()
    .withUnsubscriberService()
    .withApiRequestsFacade()
    .build();

  beforeEach(() => {
    component = new ResetPasswordComponent(routerFacade, registerFacade, unsubscriberService, apiRequestsFacade);

    routerFacade.selectRouteQueryParams.calls.reset();
    registerFacade.sendPasswordResetEmail.calls.reset();
    apiRequestsFacade.selectApiRequest.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('should make subscriptions', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(cold('a', { a: null }));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(null));

      component.ngOnInit();

      expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
      expect(apiRequestsFacade.selectApiRequest).toHaveBeenCalledTimes(1);
    });

    describe('Route Query Params subscription', () => {
      [
        { params: null, valueSet: false },
        { params: { test: 1 }, valueSet: false },
        { params: { email: 'test@example.com' }, valueSet: true }
      ].forEach((input) => {
        it(`should ${input.valueSet ? '' : 'not'} set email for params: ${input.params}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(input.params));
          apiRequestsFacade.selectApiRequest.and.returnValue(of(null));

          component.ngOnInit();

          expect(component.emailFormControl.value).toEqual(input.valueSet ? 'test@example.com' : '');
          expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
          expect(component.emailFormControl.touched).toEqual(input.valueSet);
        });
      });
    });

    describe('Api Reqeust Status subscription', () => {
      [
        null,
        undefined,
        ApiRequestStatusBuilder.start('1'),
        ApiRequestStatusBuilder.success('1'),
        ApiRequestStatusBuilder.fail('1', null)
      ].forEach((requestStatus) => {
        it(`should clear error if api reqeust status is: ${JSON.stringify(requestStatus)}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(null));
          apiRequestsFacade.selectApiRequest.and.returnValue(of(requestStatus));
          component.emailFormControl.setErrors({ test: { valid: false } });

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.sendPasswordResetLink
          );
          expect(component.emailFormControl.valid).toBeTrue();
          expect(component.apiRequestStatus).toEqual(requestStatus);
        });
      });

      [
        { request: ApiRequestStatusBuilder.fail('1', 'unkown'), controlError: 'unknown' },
        {
          request: ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.userNotFound),
          controlError: 'userNotFound'
        },
        { request: ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.invalidEmail), controlError: 'email' }
      ].forEach((input) => {
        it(`should set email control error if firebase error is: ${input.request.errorCode}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(null));
          apiRequestsFacade.selectApiRequest.and.returnValue(of(input.request));
          component.emailFormControl.setErrors(null);

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.sendPasswordResetLink
          );
          expect(component.emailFormControl.valid).toBeFalse();
          expect(component.apiRequestStatus).toEqual(input.request);
          expect(component.emailFormControl.hasError(input.controlError)).toBeTrue();
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

  describe('Reset Password', () => {
    it('should not send password reset email if form is invalid', () => {
      component.emailFormControl.setErrors({ test: { valid: false } });

      component.resetPassword();

      expect(registerFacade.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should send password reset email', () => {
      component.emailFormControl.setErrors(null);
      component.emailFormControl.setValue('user@example.com');

      component.resetPassword();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(registerFacade.sendPasswordResetEmail, 1, 'user@example.com');
    });
  });
});
