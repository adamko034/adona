import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public apiRequestStatus: ApiRequestStatus;
  public emailFormControl = new FormControl('', [Validators.email, CustomValidators.requiredValue]);

  constructor(
    private routerFacade: RouterFacade,
    private registerFacade: RegisterFacade,
    private unsubscriberService: UnsubscriberService,
    private apiRequestsFacade: ApiRequestsFacade
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
          this.emailFormControl.markAsTouched();
        }
      });

    this.apiRequestsFacade
      .selectApiRequest(apiRequestIds.sendPasswordResetLink)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((apiRequestStatus: ApiRequestStatus) => {
        this.apiRequestStatus = apiRequestStatus;
        this.setEmailControlErrorOnApiFailure();
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public resetPassword(): void {
    if (this.emailFormControl.valid) {
      this.registerFacade.sendPasswordResetEmail(this.emailFormControl.value);
    }
  }

  private setEmailControlErrorOnApiFailure(): void {
    this.emailFormControl.setErrors(null);

    if (this.apiRequestStatus && this.apiRequestStatus.failed && this.apiRequestStatus.errorCode) {
      this.emailFormControl.setErrors({ unknown: { valid: false } });

      if (this.apiRequestStatus.errorCode === firebaseAuthErrorCodes.userNotFound) {
        this.emailFormControl.setErrors({ userNotFound: { valid: false } });
        return;
      }

      if (this.apiRequestStatus.errorCode === firebaseAuthErrorCodes.invalidEmail) {
        this.emailFormControl.setErrors({ email: { valid: false } });
        return;
      }
    }
  }
}
