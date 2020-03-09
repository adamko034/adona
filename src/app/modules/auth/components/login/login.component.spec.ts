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

    authFacade.getLoginFailure.calls.reset();
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
      authFacade.getLoginFailure.and.returnValue(new Subject());

      component.ngOnInit();

      expect(authFacade.getLoginFailure).toHaveBeenCalledTimes(1);
      expect(component.showError).toBeFalsy();
      expect(component.showSpinner).toBeFalsy();
    });
  });

  describe('Get Login Failure subscription', () => {
    [true, false].forEach(isLoginFailure => {
      it(`should change flag if login failure is: ${isLoginFailure}`, () => {
        authFacade.getLoginFailure.and.returnValue(of(isLoginFailure));

        component.ngOnInit();

        expect(component.showError).toEqual(isLoginFailure);
        expect(component.showSpinner).toEqual(!isLoginFailure);
      });
    });
  });
});
