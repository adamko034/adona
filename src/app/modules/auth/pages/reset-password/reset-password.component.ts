import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { RegistrationFacade } from 'src/app/modules/auth/facade/registration-facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public backendState: BackendState;
  public emailFormControl = new FormControl('', [Validators.email, CustomValidators.requiredValue]);

  constructor(
    private routerFacade: RouterFacade,
    private registrationFacade: RegistrationFacade,
    private unsubscriberService: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    this.routerFacade
      .selectRouteQueryParams()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) => {
        if (params && params.email) {
          this.emailFormControl.setValue(params.email);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public resetPassword(): void {
    if (this.emailFormControl.valid) {
      this.backendState = BackendStateBuilder.loading();

      this.registrationFacade
        .sendPasswordResetEmail(this.emailFormControl.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((backendState: BackendState) => {
          this.backendState = backendState;
          this.setEmailControlErrorOnApiFailure();
        });
    }
  }

  private setEmailControlErrorOnApiFailure(): void {
    if (this.backendState && this.backendState.failure && this.backendState.errorCode) {
      if (this.backendState.errorCode.includes('auth')) {
        this.emailFormControl.setErrors({ userNotFound: { valid: false } });
      }
    }
  }
}
