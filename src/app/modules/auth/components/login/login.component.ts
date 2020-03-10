import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../../../core/auth/auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private loginFailureSubscription: Subscription;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });
  public showError: boolean;
  public showSpinner: boolean;

  constructor(private authFacade: AuthFacade) {}

  public ngOnInit() {
    this.showError = false;
    this.showSpinner = false;

    this.loginFailureSubscription = this.authFacade.getLoginFailure().subscribe(isLoginError => {
      console.log('changes: ', isLoginError);
      if (isLoginError != null) {
        this.showError = isLoginError;
        this.showSpinner = !isLoginError;
      }
    });
  }

  public ngOnDestroy() {
    if (this.loginFailureSubscription != null) {
      this.loginFailureSubscription.unsubscribe();
    }
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
