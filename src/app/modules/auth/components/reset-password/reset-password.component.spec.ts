import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { ResetPasswordComponent } from 'src/app/modules/auth/components/reset-password/reset-password.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Reset Password Component', () => {
  let component: ResetPasswordComponent;

  const { resetPasswordService, routerFacade } = SpiesBuilder.init()
    .withRouterFacade()
    .withResetPasswordService()
    .build();

  beforeEach(() => {
    component = new ResetPasswordComponent(routerFacade, resetPasswordService);

    routerFacade.selectRouteQueryParams.calls.reset();
    resetPasswordService.sendPasswordResetEmail.calls.reset();
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
      ].forEach(input => {
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
      const nextSpy = spyOn((component as any).unsubscribe$, 'next');
      const completeSpy = spyOn((component as any).unsubscribe$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset Password', () => {
    it('should not reset password if Email control is not valid', () => {
      component.backendState = null;
      component.emailFormControl.setValue('test');

      component.resetPassword();

      expect(resetPasswordService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(component.backendState).toEqual(null);
    });

    it('should reset password', () => {
      component.emailFormControl.setValue('test@ex.com');
      resetPasswordService.sendPasswordResetEmail.and.returnValue(of(BackendStateBuilder.success()));

      component.resetPassword();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(resetPasswordService.sendPasswordResetEmail, 1, 'test@ex.com');
      expect(component.backendState).toEqual(BackendStateBuilder.success());
    });

    describe('Handle Firebase errors', () => {
      [
        { backendState: BackendStateBuilder.loading() },
        { backendState: BackendStateBuilder.success() },
        { backendState: BackendStateBuilder.failure() },
        { backendState: BackendStateBuilder.failure('unkownErrorCode') },
        { backendState: null }
      ].forEach(input => {
        it('should not set control error if backend state failure is not auth error', () => {
          component.emailFormControl.setValue('test@ex.com');
          resetPasswordService.sendPasswordResetEmail.and.returnValue(of(input.backendState));

          component.resetPassword();

          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            resetPasswordService.sendPasswordResetEmail,
            1,
            'test@ex.com'
          );
          expect(component.backendState).toEqual(input.backendState);
          expect(component.emailFormControl.hasError('userNotFound')).toEqual(false);
        });
      });

      it('should set control error if backend state failure is not auth error', () => {
        component.emailFormControl.setValue('test@ex.com');
        resetPasswordService.sendPasswordResetEmail.and.returnValue(
          of(BackendStateBuilder.failure('auth/user-not-found'))
        );

        component.resetPassword();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(resetPasswordService.sendPasswordResetEmail, 1, 'test@ex.com');
        expect(component.backendState).toEqual(BackendStateBuilder.failure('auth/user-not-found'));
        expect(component.emailFormControl.hasError('userNotFound')).toEqual(true);
      });
    });
  });
});
