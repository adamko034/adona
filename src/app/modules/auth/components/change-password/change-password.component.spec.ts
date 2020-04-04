import { of } from 'rxjs';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { ChangePasswordComponent } from 'src/app/modules/auth/components/change-password/change-password.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Change Password Component', () => {
  let component: ChangePasswordComponent;

  const { routerFacade, resetPasswordService } = SpiesBuilder.init()
    .withRouterFacade()
    .withResetPasswordService()
    .build();

  beforeEach(() => {
    component = new ChangePasswordComponent(routerFacade, resetPasswordService);

    resetPasswordService.confirmPasswordReset.calls.reset();
    routerFacade.selectRouteQueryParams.calls.reset();
  });

  describe('On Init', () => {
    it('should make subscriptions', () => {
      routerFacade.selectRouteQueryParams.and.returnValue(of(null));

      component.ngOnInit();

      expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
    });

    describe('Route Query Params subscription', () => {
      [null, { test: 'test' }, { oobCode: 'code' }].forEach(params => {
        it(`should store oob code if query params is: ${JSON.stringify(params)}`, () => {
          (component as any).confirmPasswordResetCode = null;
          routerFacade.selectRouteQueryParams.and.returnValue(of(params));

          component.ngOnInit();

          expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
          expect((component as any).confirmPasswordResetCode).toEqual(params && params.oobCode ? 'code' : null);
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

  describe('Change Password', () => {
    it('should not send confirmation if form is invalid', () => {
      component.backendState = null;
      component.form.get('password').setErrors({ error: { valid: false } });

      component.changePassword();

      expect(resetPasswordService.confirmPasswordReset).not.toHaveBeenCalled();
      expect(component.backendState).toEqual(null);
    });

    it('should send change password confimration', () => {
      component.form.get('password').setValue('pass1');
      component.form.get('repeatPassword').setValue('pass1');
      (component as any).confirmPasswordResetCode = 'test';

      resetPasswordService.confirmPasswordReset.and.returnValue(of(BackendStateBuilder.success()));

      component.changePassword();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(resetPasswordService.confirmPasswordReset, 1, 'test', 'pass1');
      expect(component.backendState).toEqual(BackendStateBuilder.success());
    });
  });

  describe('Is Component Valid Usage', () => {
    it('should return true if code is set', () => {
      (component as any).confirmPasswordResetCode = 'test';

      expect(component.isComponentValidUsage()).toBeTrue();
    });

    [null, undefined, ''].forEach(code => {
      it(`should return false if code is: ${code}`, () => {
        (component as any).confirmPasswordResetCode = code;

        expect(component.isComponentValidUsage()).toBeFalse();
      });
    });
  });
});
