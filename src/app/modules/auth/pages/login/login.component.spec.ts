import { of, Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;

  const {
    authFacade,
    unsubscriberService,
    routerFacade
  } = SpiesBuilder.init().withRouterFacade().withAuthFacade().withUnsubscriberService().build();

  beforeEach(() => {
    component = new LoginComponent(authFacade, unsubscriberService, routerFacade);

    authFacade.selectLoginFailure.calls.reset();
    routerFacade.selectRouteQueryParams.calls.reset();
    authFacade.login.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  it('should default to empty credentials', () => {
    expect(component.loginForm.value.email).toBeFalsy();
    expect(component.loginForm.value.password).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should call facade on login', () => {
    // when
    component.login();

    // then
    expect(authFacade.login).toHaveBeenCalledTimes(1);
    expect(component.showSpinner).toBeTruthy();
    expect(component.showError).toBeFalsy();
  });

  describe('validations', () => {
    it('should validate empty email', () => {
      // when
      component.loginForm.get('email').setValue('');

      // then
      expect(component.emailEmpty()).toBeTruthy();
    });

    it('should validate invalid email', () => {
      // when
      component.loginForm.get('email').setValue('test');

      // then
      expect(component.emailNotValid()).toBeTruthy();
    });

    it('should pass valid email', () => {
      // when
      component.loginForm.get('email').setValue('test@test.com');

      // then
      expect(component.emailEmpty()).toBeFalsy();
      expect(component.emailNotValid()).toBeFalsy();
    });

    it('should validate empty password', () => {
      // when
      component.loginForm.get('password').setValue('');

      // then
      expect(component.passwordEmpty()).toBeTruthy();
    });

    it('should pass valid password', () => {
      // when
      component.loginForm.get('password').setValue('secret pass');

      // then
      expect(component.passwordEmpty()).toBeFalsy();
    });
  });

  describe('On Init', () => {
    it('should make subscriptions', () => {
      authFacade.selectLoginFailure.and.returnValue(new Subject());
      routerFacade.selectRouteQueryParams.and.returnValue(of(null));

      component.ngOnInit();

      expect(authFacade.selectLoginFailure).toHaveBeenCalledTimes(1);
      expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);
      expect(component.showError).toBeFalsy();
      expect(component.showSpinner).toBeFalsy();
    });

    describe('Select Router Query Params Subscriptions', () => {
      [
        { params: null, expectedInvitationId: undefined },
        { params: { test: 'test' }, expectedInvitationId: undefined },
        { params: { inv: 'test' }, expectedInvitationId: 'test' }
      ].forEach((input) => {
        it(`should ${input.expectedInvitationId ? '' : 'not'} set invitation id if params is: ${JSON.stringify(
          input.params
        )}`, () => {
          routerFacade.selectRouteQueryParams.and.returnValue(of(input.params));
          authFacade.selectLoginFailure.and.returnValue(of(false));

          component.ngOnInit();

          expect(routerFacade.selectRouteQueryParams).toHaveBeenCalledTimes(1);

          component.login();
          JasmineCustomMatchers.toHaveBeenCalledTimesWith(
            authFacade.login,
            1,
            { email: '', password: '' },
            input.expectedInvitationId
          );
        });
      });
    });

    describe('Get Login Failure subscription', () => {
      [true, false, null].forEach((isLoginFailure) => {
        it(`should change flags if login failure is: ${isLoginFailure}`, () => {
          component.showError = false;
          component.showSpinner = false;

          routerFacade.selectRouteQueryParams.and.returnValue(of(null));
          authFacade.selectLoginFailure.and.returnValue(of(isLoginFailure));

          component.ngOnInit();

          if (isLoginFailure == null) {
            expect(component.showError).toEqual(false);
            expect(component.showSpinner).toEqual(false);
            return;
          }

          expect(component.showError).toEqual(isLoginFailure);
          expect(component.showSpinner).toEqual(!isLoginFailure);
        });
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.ngOnDestroy();
      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });
});
