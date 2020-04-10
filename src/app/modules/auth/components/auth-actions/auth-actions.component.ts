import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-auth-actions',
  template: ''
})
export class AuthActionsComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  constructor(
    private routerFacade: RouterFacade,
    private unsubscriberService: UnsubscriberService,
    private navigationService: NavigationService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    this.routerFacade
      .selectRouteQueryParams()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) => {
        if (this.areParamsInvalid(params)) {
          this.navigationService.toLogin();
          return;
        }

        const { mode, oobCode } = params;

        if (mode.toLowerCase() === 'resetpassword') {
          this.navigationService.toResetPassword(oobCode);
        } else if (mode.toLowerCase() === 'verifyemail') {
          this.navigationService.toEmailVerified(oobCode);
        } else {
          this.navigationService.toLogin();
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  private areParamsInvalid(params: any) {
    return !params || !params.oobCode || !params.mode;
  }
}
