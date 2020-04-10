import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { adonaAuthErrorCodes } from 'src/app/modules/auth/constants/adona-auth-error-codes.constants';
import { authErrorMessages } from 'src/app/modules/auth/constants/auth-error-messages.constants';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;
  private confirmPasswordResetCode: string;

  public sessionExpired = false;
  public errorMessage = '';
  public form: FormGroup = new FormGroup({
    password: new FormControl('', CustomValidators.requiredValue),
    repeatPassword: new FormControl('', CustomValidators.requiredValue)
  });

  public apiRequestStatus: ApiRequestStatus;

  constructor(
    private routerFacade: RouterFacade,
    private registerFacade: RegisterFacade,
    private unsubscriber: UnsubscriberService,
    private apiRequestsFacade: ApiRequestsFacade
  ) {
    this.destroyed$ = this.unsubscriber.create();
  }

  public ngOnInit(): void {
    this.routerFacade
      .selectRouteQueryParams()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: any) => {
        if (params && params.oobCode) {
          this.confirmPasswordResetCode = params.oobCode;
        }
      });

    this.apiRequestsFacade
      .selectApiRequest(apiRequestIds.confirmPasswordResetLink)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((apiRequestStatus: ApiRequestStatus) => {
        this.apiRequestStatus = apiRequestStatus;
        this.setErrorMessage();
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
  }

  public changePassword(): void {
    if (this.form.valid) {
      this.registerFacade.confirmPasswordReset(this.confirmPasswordResetCode, this.form.get('password').value);
    }
  }

  public isComponentValidUsage(): boolean {
    return !!this.confirmPasswordResetCode;
  }

  public shouldShowForm(): boolean {
    return this.isComponentValidUsage() && !this.apiRequestStatus?.succeded && !this.sessionExpired;
  }

  private setErrorMessage(): void {
    this.errorMessage = '';
    this.sessionExpired = false;
    if (this.apiRequestStatus && this.apiRequestStatus?.failed && this.apiRequestStatus?.errorCode) {
      if (
        this.apiRequestStatus.errorCode === firebaseAuthErrorCodes.oobCodeExpired ||
        this.apiRequestStatus.errorCode === firebaseAuthErrorCodes.oobCodeInvalid
      ) {
        this.sessionExpired = true;
        this.errorMessage = authErrorMessages[adonaAuthErrorCodes.invalidSession];
      } else if (this.apiRequestStatus.errorCode === firebaseAuthErrorCodes.weakPassword) {
        this.errorMessage = authErrorMessages[firebaseAuthErrorCodes.weakPassword];
      }
    }
  }
}
