import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { RegistrationFacade } from '../../facade/registration-facade';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public emailSent = false;
  public showLoader = false;
  public showError = false;

  constructor(private registrationFacade: RegistrationFacade, private unsubscriberService: UnsubscriberService) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.emailSent = false;
    this.showLoader = false;
    this.showError = false;
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public resendConfirmationLink() {
    this.showLoader = true;
    this.registrationFacade
      .resendEmailConfirmationLink()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        () => {
          this.showLoader = false;
          this.emailSent = true;
          this.showError = false;
        },
        () => {
          this.showLoader = false;
          this.showError = true;
          this.emailSent = false;
        }
      );
  }
}
