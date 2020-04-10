import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public title: string;

  constructor(private routerFacade: RouterFacade, private unsubscriberService: UnsubscriberService) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.routerFacade
      .selectCurrentRute()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((route: string) => {
        this.title = this.getTitle(route);
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  private getTitle(route: string): string {
    if (route.toLowerCase().includes('register')) {
      return 'Register';
    } else if (route.toLowerCase().includes('verifyemail') || route.toLocaleLowerCase().includes('emailverified')) {
      return 'Email Verification';
    } else if (route.toLowerCase().includes('login/resetpassword')) {
      return 'Forgotten Password';
    } else if (route.toLowerCase().includes('login/changepassword')) {
      return 'Change Password';
    }

    return 'Login';
  }
}
