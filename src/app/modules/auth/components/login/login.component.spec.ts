import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;

  const authFacade = jasmine.createSpyObj('AuthFacade', ['login', 'getLoginFailure']);

  beforeEach(() => {
    component = new LoginComponent(authFacade);
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
});
