import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { AuthFacade } from '../../../../core/auth/auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });
  public showError: boolean;
  public showSpinner: boolean;
  public showPassword = false;

  constructor(private authFacade: AuthFacade, private unsubscriberService: UnsubscriberService) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.showError = false;
    this.showSpinner = false;

    this.authFacade
      .selectLoginFailure()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoginError) => {
        if (isLoginError != null) {
          this.showError = isLoginError;
          this.showSpinner = !isLoginError;
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public login() {
    this.showSpinner = true;
    this.showError = false;
    this.authFacade.login(this.loginForm.value);
  }

  public emailNotValid(): boolean {
    const emailControl = this.loginForm.get('email');

    return emailControl.hasError('email') && !emailControl.hasError('required');
  }

  public emailEmpty(): boolean {
    return this.loginForm.get('email').hasError('required');
  }

  public passwordEmpty(): boolean {
    return this.loginForm.get('password').hasError('required');
  }
}
