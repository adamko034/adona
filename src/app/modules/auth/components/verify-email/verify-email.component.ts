import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from 'src/app/core/auth/auth.facade';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private emailSentSubscription: Subscription;

  public emailSent = false;
  public showLoader = false;
  public showError = false;

  constructor(private authFacade: AuthFacade) {}

  public ngOnInit() {
    this.emailSent = false;
    this.showLoader = false;
    this.showError = false;
  }

  public ngOnDestroy() {
    if (this.emailSentSubscription) {
      this.emailSentSubscription.unsubscribe();
    }
  }

  public resendConfirmationLink() {
    this.showLoader = true;
    this.emailSentSubscription = this.authFacade.sendEmailConfirmationLink().subscribe(
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
