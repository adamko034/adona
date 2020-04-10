import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatus } from 'src/app/core/api-requests/models/api-request-status/api-request-status.model';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public apiRequestStatus: ApiRequestStatus;

  constructor(
    private registerFacade: RegisterFacade,
    private unsubscriberService: UnsubscriberService,
    private apiRequestsFacade: ApiRequestsFacade
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.apiRequestsFacade
      .selectApiRequest(apiRequestIds.sendEmailVerificationLink)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((apiRequestStatus: ApiRequestStatus) => {
        this.apiRequestStatus = apiRequestStatus;
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public sendEmailConfirmationLink() {
    this.registerFacade.sendEmailVerificationLink();
  }
}
