import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ApiRequestStateBuilder } from 'src/app/core/gui/model/backend-state/api-request-state.builder';
import { ResetPasswordComponent } from 'src/app/modules/auth/pages/reset-password/reset-password.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Reset Password Component', () => {
  let component: ResetPasswordComponent;

  const {
    registrationFacade,
    routerFacade,
    unsubscriberService
  } = SpiesBuilder.init().withRouterFacade().withRegistrationFacade().withUnsubscriberService().build();

  beforeEach(() => {
    component = new ResetPasswordComponent(routerFacade, registrationFacade, unsubscriberService);

    routerFacade.selectRouteQueryParams.calls.reset();
    registrationFacade.sendPasswordResetEmail.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('should make subscriptions', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(cold('a', { a: null }));

      component.ngOnInit();

      expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
    });

    describe('Route Query Params subscription', () => {
      [
        { params: null, valueSet: false },
        { params: { test: 1 }, valueSet: false },
        { params: { email: 'test@example.com' }, valueSet: true }
      ].forEach((input) => {
        it(`should ${input.valueSet ? '' : 'not'} set email for params: ${input.params}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(input.params));

          component.ngOnInit();

          expect(component.emailFormControl.value).toEqual(input.valueSet ? 'test@example.com' : '');
          expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
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
    it('should not reset password if Email control is not valid', () => {
      component.apiRequestState = null;
      component.emailFormControl.setValue('test');

      component.resetPassword();

      expect(registrationFacade.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(component.apiRequestState).toEqual(null);
    });

    it('should reset password', () => {
      component.emailFormControl.setValue('test@ex.com');
      registrationFacade.sendPasswordResetEmail.and.returnValue(of(ApiRequestStateBuilder.success()));

      component.resetPassword();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationFacade.sendPasswordResetEmail, 1, 'test@ex.com');
      expect(component.apiRequestState).toEqual(ApiRequestStateBuilder.success());
    });

    describe('Handle Firebase errors', () => {
      [
        { apiRequestState: ApiRequestStateBuilder.start() },
        { apiRequestState: ApiRequestStateBuilder.success() },
        { apiRequestState: ApiRequestStateBuilder.fail() },
        { apiRequestState: ApiRequestStateBuilder.fail('unkownErrorCode') },
        { apiRequestState: null }
      ].forEach((input) => {
        it('should not set control error if backend state failure is not auth error', () => {
          component.emailFormControl.setValue('test@ex.com');
          registrationFacade.sendPasswordResetEmail.and.returnValue(of(input.apiRequestState));

          component.resetPassword();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationFacade.sendPasswordResetEmail, 1, 'test@ex.com');
          expect(component.apiRequestState).toEqual(input.apiRequestState);
          expect(component.emailFormControl.hasError('userNotFound')).toEqual(false);
        });
      });

      it('should set control error if backend state failure is not auth error', () => {
        component.emailFormControl.setValue('test@ex.com');
        registrationFacade.sendPasswordResetEmail.and.returnValue(
          of(ApiRequestStateBuilder.fail('auth/user-not-found'))
        );

        component.resetPassword();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(registrationFacade.sendPasswordResetEmail, 1, 'test@ex.com');
        expect(component.apiRequestState).toEqual(ApiRequestStateBuilder.fail('auth/user-not-found'));
        expect(component.emailFormControl.hasError('userNotFound')).toEqual(true);
      });
    });
  });
});
