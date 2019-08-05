import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthFacade } from '../../../../core/auth/auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginFailure$: Observable<boolean>;
  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authFacade: AuthFacade) {
    this.loginFailure$ = authFacade.getLoginFailure();
  }

  ngOnInit() {}

  public login() {
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
