import { Component, OnInit } from '@angular/core';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { TransitionCheckState } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginFailure$: Observable<boolean>;

  public credentials = {
    email: '',
    password: ''
  };

  constructor(private authFacade: AuthFacade) {
    this.loginFailure$ = authFacade.getLoginFailure();
  }

  ngOnInit() {}

  public login() {
    this.authFacade.login(this.credentials);
  }

  public loginDisabled(): boolean {
    return this.credentials.email.length === 0 || this.credentials.password.length === 0;
  }

  public isFieldEmpty(fieldName: string): boolean {
    switch (fieldName.toLowerCase()) {
      case 'email':
        console.log(this.credentials.email.length === 0);
        return this.credentials.email.length === 0;
      case 'password':
        return this.credentials.password.length === 0;
      default:
        return false;
    }
  }
}
