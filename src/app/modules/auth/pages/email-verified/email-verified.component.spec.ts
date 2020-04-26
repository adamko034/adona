import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { authErrorMessages } from 'src/app/modules/auth/constants/auth-error-messages.constants';
import { EmailVerifiedComponent } from 'src/app/modules/auth/pages/email-verified/email-verified.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Email Verified Component', () => {
  let component: EmailVerifiedComponent;

  const {
    routerFacade,
    unsubscriberService,
    registerFacade,
    apiRequestsFacade
  } = SpiesBuilder.init()
    .withRouterFacade()
    .withUnsubscriberService()
    .withRegisterFacade()
    .withApiRequestsFacade()
    .build();

  beforeEach(() => {
    component = new EmailVerifiedComponent(routerFacade, unsubscriberService, registerFacade, apiRequestsFacade);
  });

  describe('Constructor', () => {
    it('should create unsubscriber subject', () => {
      unsubscriberService.create.calls.reset();
      component = new EmailVerifiedComponent(routerFacade, unsubscriberService, registerFacade, apiRequestsFacade);
      expect(unsubscriberService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should complete all subscriptions', () => {
      component.ngOnDestroy();
      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Init', () => {
    beforeEach(() => {
      routerFacade.selectRouteQueryParams.calls.reset();
      apiRequestsFacade.selectApiRequest.calls.reset();
      registerFacade.confirmEmailVerification.calls.reset();
    });

    it('should make all needed subscriptions', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of(null));
      apiRequestsFacade.selectApiRequest.and.returnValue(of(null));

      component.ngOnInit();

      expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.selectApiRequest,
        1,
        apiRequestIds.confirmEmailVerification
      );
    });

    describe('Route Query Params subscription', () => {
      [null, undefined, { oobCode: null }, { oobCode: '' }, { testCode: 'test' }].forEach((params) => {
        it(`should set Invalid Component Usage flag and not confirm email when params equal ${JSON.stringify(
          params
        )}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(params));
          apiRequestsFacade.selectApiRequest.and.returnValue(of(null));

          component.ngOnInit();

          expect(registerFacade.confirmEmailVerification).not.toHaveBeenCalled();
          expect(component.invalidComponentUsage).toBeTrue();
        });
      });

      it('should confirm email when oobCode param is passed', () => {
        routerFacade.selectRouteQueryParams.and.returnValue(of({ oobCode: '123' }));
        apiRequestsFacade.selectApiRequest.and.returnValue(of(null));
        component.invalidComponentUsage = true;

        component.ngOnInit();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(registerFacade.confirmEmailVerification, 1, '123');
        expect(component.invalidComponentUsage).toBeFalse();
      });
    });

    describe('Api Request Status subscription', () => {
      [
        null,
        undefined,
        ApiRequestStatusBuilder.start('1'),
        ApiRequestStatusBuilder.success('1'),
        ApiRequestStatusBuilder.fail('1', '')
      ].forEach((requestStatus) => {
        it(`should unset error message for request status: ${JSON.stringify(requestStatus)}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(null));
          apiRequestsFacade.selectApiRequest.and.returnValue(of(requestStatus));
          component.errorMessage = 'test message';

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.confirmEmailVerification
          );
          expect(component.apiRequestStatus).toEqual(requestStatus);
          expect(component.errorMessage).toEqual('');
        });
      });

      [
        ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.invalidEmail),
        ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.userNotFound)
      ].forEach((requestStatus) => {
        it(`should set error message if api request fail with error code ${requestStatus.errorCode}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(null));
          apiRequestsFacade.selectApiRequest.and.returnValue(of(requestStatus));
          component.errorMessage = 'test message';

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.confirmEmailVerification
          );
          expect(component.apiRequestStatus).toEqual(requestStatus);
          expect(component.errorMessage).toEqual(authErrorMessages[requestStatus.errorCode]);
        });
      });
    });
  });
});
