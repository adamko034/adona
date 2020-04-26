import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { authErrorMessages } from 'src/app/modules/auth/constants/auth-error-messages.constants';
import { RegisterComponent } from 'src/app/modules/auth/pages/register/register.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Register Component', () => {
  let component: RegisterComponent;

  const {
    registerFacade,
    apiRequestsFacade,
    unsubscriberService
  } = SpiesBuilder.init().withRegisterFacade().withUnsubscriberService().withApiRequestsFacade().build();

  beforeEach(() => {
    component = new RegisterComponent(registerFacade, apiRequestsFacade, unsubscriberService);
  });

  describe('Constructor', () => {
    it('should set default values', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
      expect(component.form.value).toEqual({ email: '', password: '', confirmPassword: '' });
    });
  });

  describe('On Init', () => {
    beforeEach(() => {
      apiRequestsFacade.selectApiRequest.calls.reset();
    });

    describe('Register Error Subscription', () => {
      [
        ApiRequestStatusBuilder.start('1'),
        ApiRequestStatusBuilder.success('1'),
        null,
        undefined,
        ApiRequestStatusBuilder.fail('1', null)
      ].forEach((requestStatus) => {
        it(`should unset error message if reqeust status is: ${JSON.stringify(requestStatus)}`, () => {
          component.errorMessage = 'test';
          apiRequestsFacade.selectApiRequest.and.returnValue(of(requestStatus));

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.register
          );
          expect(component.apiRequestStatus).toEqual(requestStatus);
          expect(component.errorMessage).toEqual('');
        });
      });

      it('should handle unkown error', () => {
        component.errorMessage = 'test';
        apiRequestsFacade.selectApiRequest.and.returnValue(of(ApiRequestStatusBuilder.fail('1', 'unkownError')));

        component.ngOnInit();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.selectApiRequest, 1, apiRequestIds.register);
        expect(component.apiRequestStatus).toEqual(ApiRequestStatusBuilder.fail('1', 'unkownError'));
        expect(component.errorMessage).toBeFalsy();
      });

      it('should handle network error', () => {
        component.errorMessage = 'test';
        apiRequestsFacade.selectApiRequest.and.returnValue(
          of(ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.networkFailure))
        );

        component.ngOnInit();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.selectApiRequest, 1, apiRequestIds.register);
        expect(component.apiRequestStatus).toEqual(
          ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.networkFailure)
        );
        expect(component.errorMessage).toEqual(authErrorMessages[firebaseAuthErrorCodes.networkFailure]);
      });

      [firebaseAuthErrorCodes.emailAlreadyInUse, firebaseAuthErrorCodes.invalidEmail].forEach((errorCode) => {
        it(`should handle ${errorCode} error`, () => {
          component.errorMessage = 'test';
          apiRequestsFacade.selectApiRequest.and.returnValue(of(ApiRequestStatusBuilder.fail('1', errorCode)));
          component.form.get('email').setValue('user@example.com');
          const expectedErrorMessage = authErrorMessages[errorCode].replace('{1}', 'user@example.com');

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.register
          );
          expect(component.apiRequestStatus).toEqual(ApiRequestStatusBuilder.fail('1', errorCode));
          expect(component.errorMessage).toEqual(expectedErrorMessage);
          expect(component.form.get('email').hasError('backend'));
        });

        it('should handle weak password error', () => {
          component.errorMessage = 'test';
          apiRequestsFacade.selectApiRequest.and.returnValue(
            of(ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.weakPassword))
          );
          component.form.get('password').setValue('test1');

          component.ngOnInit();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            apiRequestsFacade.selectApiRequest,
            1,
            apiRequestIds.register
          );
          expect(component.apiRequestStatus).toEqual(
            ApiRequestStatusBuilder.fail('1', firebaseAuthErrorCodes.weakPassword)
          );
          expect(component.errorMessage).toEqual(authErrorMessages[firebaseAuthErrorCodes.weakPassword]);
          expect(component.form.get('password').hasError('backend'));
        });
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      registerFacade.register.calls.reset();
    });

    it('should not register if form is not valid', () => {
      component.form.get('email').setErrors({ email: { valid: false } });

      component.register();

      expect(registerFacade.register).not.toHaveBeenCalled();
    });

    it('should register', () => {
      component.form.get('email').setErrors(null);
      component.form.get('email').setValue('user@example.com');
      component.form.get('password').setValue('pass1');
      component.form.get('confirmPassword').setValue('pass1');

      component.register();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        registerFacade.register,
        1,
        CredentialsBuilder.from('user@example.com', 'pass1').build()
      );
    });
  });
});
