import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { ResetPasswordService } from 'src/app/modules/auth/services/reset-password/reset-password.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  public backendState: BackendState;
  public emailFormControl = new FormControl('', [Validators.email, CustomValidators.requiredValue]);

  constructor(private routerFacade: RouterFacade, private resetPasswordService: ResetPasswordService) {}

  public ngOnInit(): void {
    this.routerFacade
      .selectRouteQueryParams()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        if (params && params.email) {
          this.emailFormControl.setValue(params.email);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public resetPassword(): void {
    if (this.emailFormControl.valid) {
      this.backendState = BackendStateBuilder.loading();

      this.resetPasswordService
        .sendPasswordResetEmail(this.emailFormControl.value)
        .pipe(takeUntil(this.unsubscribe$))
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
