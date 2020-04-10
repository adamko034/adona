import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestStateBuilder } from 'src/app/core/gui/model/backend-state/api-request-state.builder';
import { ApiRequestState } from 'src/app/core/gui/model/backend-state/api-request-state.model';
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

  public apiRequestState: ApiRequestState;
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
      this.apiRequestState = ApiRequestStateBuilder.start();

      this.registrationFacade
        .sendPasswordResetEmail(this.emailFormControl.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((apiRequestState: ApiRequestState) => {
          this.apiRequestState = apiRequestState;
          this.setEmailControlErrorOnApiFailure();
        });
    }
  }

  private setEmailControlErrorOnApiFailure(): void {
    if (this.apiRequestState && this.apiRequestState.failed && this.apiRequestState.errorCode) {
      if (this.apiRequestState.errorCode.includes('auth')) {
        this.emailFormControl.setErrors({ userNotFound: { valid: false } });
      }
    }
  }
}
