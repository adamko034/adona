import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() passwordControlName: string;
  @Input() repeatPasswordControlName: string;
  @Input() passwordInputPlaceholder?: string = 'Password';

  public showPassword = false;
  public showConfirmPassword = false;

  constructor() {}

  public ngOnInit(): void {}

  public onPasswordStrengthChanged(strength: number): void {
    const validationError = strength > 80 ? null : { passwordStrength: { valid: false } };
    this.form.get(this.passwordControlName).setErrors(validationError);
  }

  public onValueInput(): void {
    const password = this.form.get(this.passwordControlName).value;
    const repeatPassword = this.form.get(this.repeatPasswordControlName).value;

    if (password && repeatPassword && password === repeatPassword) {
      this.form.get(this.repeatPasswordControlName).setErrors(null);
      return;
    }

    if (password && repeatPassword && password !== repeatPassword) {
      this.form.get(this.repeatPasswordControlName).setErrors({ matching: { valid: false } });
    }
  }
}
