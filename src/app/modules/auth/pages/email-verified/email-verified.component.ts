import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { authErrorMessages } from 'src/app/modules/auth/constants/auth-error-messages.constants';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss']
})
export class EmailVerifiedComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public invalidComponentUsage = false;
  public errorMessage = '';

  public apiRequestStatus: ApiRequestStatus;

  constructor(
    private routerFacade: RouterFacade,
    private unsubscriberService: UnsubscriberService,
    private registerFacade: RegisterFacade,
    private apiRequestsFacade: ApiRequestsFacade
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    this.routerFacade
      .selectRouteQueryParams()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) => {
        this.invalidComponentUsage = !params?.oobCode;

        if (params?.oobCode) {
          this.registerFacade.confirmEmailVerification(params.oobCode);
        }
      });

    this.apiRequestsFacade
      .selectApiRequest(apiRequestIds.confirmEmailVerification)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((apiRequestStatus: ApiRequestStatus) => {
        this.apiRequestStatus = apiRequestStatus;
        this.errorMessage = '';

        if (apiRequestStatus?.failed && apiRequestStatus?.errorCode) {
          this.errorMessage = authErrorMessages[apiRequestStatus.errorCode];
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }
}
