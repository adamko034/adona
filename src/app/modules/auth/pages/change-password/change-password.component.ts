import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { RegistrationFacade } from 'src/app/modules/auth/facade/registration-facade';
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

  public form: FormGroup = new FormGroup({
    password: new FormControl('', CustomValidators.requiredValue),
    repeatPassword: new FormControl('', CustomValidators.requiredValue)
  });

  public backendState: BackendState;

  constructor(
    private routerFacade: RouterFacade,
    private registrationFacade: RegistrationFacade,
    private unsubscriber: UnsubscriberService
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
  }

  public ngOnDestroy(): void {
    this.unsubscriber.complete(this.destroyed$);
  }

  public changePassword(): void {
    if (this.form.valid) {
      this.backendState = BackendStateBuilder.loading();
      this.registrationFacade
        .confirmPasswordReset(this.confirmPasswordResetCode, this.form.get('password').value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((backendState: BackendState) => (this.backendState = backendState));
    }
  }

  public isComponentValidUsage(): boolean {
    return !!this.confirmPasswordResetCode;
  }
}
