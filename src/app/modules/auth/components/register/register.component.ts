import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { registrationErrorCodes } from 'src/app/modules/auth/constants/registration-error-messages.constants';
import { RegistrationFacade } from 'src/app/modules/auth/facade/registration-facade';
import { RegistrationError } from 'src/app/modules/auth/models/registration/registration-error.model';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private registrationSubscription: Subscription;
  private registrationErrorSubscription: Subscription;

  public errorMessage: string;
  public showSpinner = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, CustomValidators.requiredValue]),
    password: new FormControl('', [CustomValidators.requiredValue]),
    confirmPassword: new FormControl('', [CustomValidators.requiredValue])
  });

  constructor(private registrationFacade: RegistrationFacade, private navigationService: NavigationService) {}

  public ngOnInit(): void {
    this.registrationErrorSubscription = this.registrationFacade
      .selectRegistrationError()
      .subscribe((error: RegistrationError) => {
        this.showSpinner = false;

        if (!error) {
          this.errorMessage = null;
          return;
        }

        this.errorMessage = error.message;
        this.handleEmailExistsError(error);
        this.handlePasswordsDoNotMatchError(error);
      });
  }

  public ngOnDestroy(): void {
    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }

    if (this.registrationErrorSubscription) {
      this.registrationErrorSubscription.unsubscribe();
    }
  }

  public register(): void {
    this.registrationFacade.clearRegistrationErrors();

    if (this.form.invalid) {
      this.registrationFacade.pushFormInvalidError();
      return;
    }

    if (!this.arePassowrdsTheSame()) {
      this.registrationFacade.pushPasswordsDoNotMatchError();
      return;
    }

    this.showSpinner = true;
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    this.registrationSubscription = this.registrationFacade
      .register(CredentialsBuilder.from(email, password).build())
      .subscribe(success => {
        if (success) {
          this.showSpinner = false;
          this.navigationService.toVerifyEmail();
        }
      });
  }

  private handleEmailExistsError(error: RegistrationError): void {
    if (error.code === registrationErrorCodes.emailExists) {
      this.errorMessage = this.errorMessage.replace('{1}', this.form.get('email').value);
      this.form.get('email').setErrors({ [registrationErrorCodes.emailExists]: { isValid: false } });
    }
  }

  private handlePasswordsDoNotMatchError(error: RegistrationError): void {
    if (error.code === registrationErrorCodes.passwordsDoNotMatch) {
      this.form.get('confirmPassword').setErrors({ [registrationErrorCodes.passwordsDoNotMatch]: { isValid: false } });
    }
  }

  private arePassowrdsTheSame(): boolean {
    return this.form.get('confirmPassword').value === this.form.get('password').value;
  }
}
