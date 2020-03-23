import { of, Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;

  const { authFacade } = SpiesBuilder.init()
    .withAuthFacade()
    .build();

  beforeEach(() => {
    component = new LoginComponent(authFacade);

    authFacade.selectLoginFailure.calls.reset();
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
    it('should init to default on subscribe to failures', () => {
      authFacade.selectLoginFailure.and.returnValue(new Subject());

      component.ngOnInit();

      expect(authFacade.selectLoginFailure).toHaveBeenCalledTimes(1);
      expect(component.showError).toBeFalsy();
      expect(component.showSpinner).toBeFalsy();
    });

    describe('Get Login Failure subscription', () => {
      [true, false, null].forEach(isLoginFailure => {
        it(`should change flags if login failure is: ${isLoginFailure}`, () => {
          component.showError = false;
          component.showSpinner = false;

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
      (component as any).loginFailureSubscription = new Subject();
      const spy = spyOn((component as any).loginFailureSubscription, 'unsubscribe');

      component.ngOnDestroy();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
