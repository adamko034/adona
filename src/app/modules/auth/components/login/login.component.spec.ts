import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['login', 'getLoginFailure']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [{ provide: AuthFacade, useValue: authFacadeSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default to empty credentials', () => {
    expect(component.loginForm.value.email).toBeFalsy();
    expect(component.loginForm.value.password).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should call facade on login', () => {
    // given
    const facade = TestBed.get(AuthFacade);

    // when
    component.login();

    // then
    expect(facade.login).toHaveBeenCalledTimes(1);
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
