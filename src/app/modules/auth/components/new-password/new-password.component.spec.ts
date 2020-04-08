import { FormControl, FormGroup } from '@angular/forms';
import { NewPasswordComponent } from 'src/app/modules/auth/components/new-password/new-password.component';

describe('New Password Component', () => {
  let component: NewPasswordComponent;

  beforeEach(() => {
    component = new NewPasswordComponent();

    component.form = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    });
    component.passwordControlName = 'password';
    component.repeatPasswordControlName = 'confirmPassword';
  });

  describe('On Password Strength Change', () => {
    [50, 80].forEach(strenght => {
      it(`should set Password control error if password is weak (${strenght})`, () => {
        component.form.get('password').setErrors(null);

        component.onPasswordStrengthChanged(strenght);

        expect(component.form.get('password').hasError('passwordStrength')).toBeTrue();
      });
    });

    [81, 100].forEach(strenght => {
      it(`should unset Password control error when password is strong (${strenght})`, () => {
        component.form.get('password').setErrors({ passwordStrength: { valid: false } });

        component.onPasswordStrengthChanged(strenght);

        expect(component.form.get('password').hasError('passwordStrength')).toBeFalse();
      });
    });
  });

  describe('On Value Input', () => {
    [
      { password: '', confirmPassword: 'pass1' },
      { password: 'pass1', confirmPassword: '' }
    ].forEach(input => {
      it(`should not change errors if password is: ${input.password} and confirm password is: ${input.confirmPassword}`, () => {
        component.form.get('password').setValue(input.password);
        component.form.get('confirmPassword').setValue(input.confirmPassword);
        component.form.get('confirmPassword').setErrors({ unkownError: { valid: false } });

        component.onValueInput();

        expect(component.form.get('confirmPassword').hasError('unkownError')).toBeTrue();
      });
    });
  });

  it('should clear errors if passwords match', () => {
    component.form.get('password').setValue('pass1');
    component.form.get('confirmPassword').setValue('pass1');
    component.form.get('confirmPassword').setErrors({ unkownError: { valid: false } });

    component.onValueInput();

    expect(component.form.get('confirmPassword').hasError('unkownError')).toBeFalse();
  });

  it('should set Matching error', () => {
    component.form.get('password').setValue('pass1');
    component.form.get('confirmPassword').setValue('pass2');
    component.form.get('confirmPassword').setErrors(null);

    component.onValueInput();

    expect(component.form.get('confirmPassword').hasError('matching')).toBeTrue();
  });
});
