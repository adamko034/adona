import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthFacade } from 'src/app/core/auth/auth.facade';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;
  private invitationId: string;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });
  public showError: boolean;
  public showSpinner: boolean;
  public showPassword = false;

  constructor(
    private authFacade: AuthFacade,
    private unsubscriberService: UnsubscriberService,
    private routerFacade: RouterFacade
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.showError = false;
    this.showSpinner = false;

    combineLatest([this.routerFacade.selectRouteQueryParams(), this.authFacade.selectLoginFailure()])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([params, isLoginError]) => {
        this.handleIsLoginError(isLoginError);
        this.handleRouteQueryParams(params);
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public login() {
    this.showSpinner = true;
    this.showError = false;
    this.authFacade.login(this.loginForm.value, this.invitationId);
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

  private handleRouteQueryParams(params: Params): void {
    if (params?.inv) {
      this.invitationId = params.inv;
    }
  }

  private handleIsLoginError(isLoginError: boolean): void {
    if (isLoginError != null) {
      this.showError = isLoginError;
      this.showSpinner = !isLoginError;
    }
  }
}
