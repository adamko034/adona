import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { registrationErrorCodes } from 'src/app/modules/auth/constants/registration-error-messages.constants';
import { RegistrationFacade } from 'src/app/modules/auth/facade/registration-facade';
import { RegistrationError } from 'src/app/modules/auth/models/registration/registration-error.model';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public errorMessage: string;
  public showSpinner = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, CustomValidators.requiredValue]),
    password: new FormControl('', [CustomValidators.requiredValue]),
    confirmPassword: new FormControl('', [CustomValidators.requiredValue])
  });

  constructor(
    private registrationFacade: RegistrationFacade,
    private navigationService: NavigationService,
    private unsubscriberService: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    this.registrationFacade
      .selectRegistrationError()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((error: RegistrationError) => {
        this.showSpinner = false;

        if (!error) {
          this.errorMessage = null;
          return;
        }

        this.errorMessage = error.message;
        this.handleEmailExistsError(error);
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public register(): void {
    this.registrationFacade.clearRegistrationErrors();

    if (this.form.invalid) {
      this.registrationFacade.pushFormInvalidError();
      return;
    }

    this.showSpinner = true;
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    this.registrationFacade
      .register(CredentialsBuilder.from(email, password).build())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((success) => {
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
}
