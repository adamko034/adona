import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { authErrorMessages } from 'src/app/modules/auth/constants/auth-error-messages.constants';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;
  private invitationId: string;

  public apiRequestStatus: ApiRequestStatus;
  public errorMessage: string;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, CustomValidators.requiredValue]),
    password: new FormControl('', [CustomValidators.requiredValue]),
    confirmPassword: new FormControl('', [CustomValidators.requiredValue])
  });

  constructor(
    private registerFacade: RegisterFacade,
    private apiRequestsFacade: ApiRequestsFacade,
    private unsubscriberService: UnsubscriberService,
    private routerFacade: RouterFacade
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    combineLatest([
      this.apiRequestsFacade.selectApiRequest(apiRequestIds.register),
      this.routerFacade.selectRouteQueryParams()
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([apiRequestStatus, params]) => {
        this.apiRequestStatus = apiRequestStatus;
        this.invitationId = params?.inv;
        this.handleErrors();
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public register(): void {
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;

      this.registerFacade.register(CredentialsBuilder.from(email, password).build(), this.invitationId);
    }
  }

  private handleErrors(): void {
    this.errorMessage = '';
    if (this.apiRequestStatus?.failed && this.apiRequestStatus?.errorCode) {
      this.errorMessage = authErrorMessages[this.apiRequestStatus.errorCode];

      if (this.apiRequestStatus.errorCode.includes('email')) {
        this.errorMessage = this.errorMessage.replace('{1}', this.form.get('email').value);
        this.form.get('email').setErrors({ backend: { valid: false } });
        return;
      }

      if (this.apiRequestStatus.errorCode.includes('password')) {
        this.form.get('password').setErrors({ backend: { valid: false } });
      }
    }
  }
}
