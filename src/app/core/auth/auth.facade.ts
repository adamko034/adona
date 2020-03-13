import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { authActions } from '../store/actions/auth.actions';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthFacade {
  constructor(private store: Store<AuthState>, private authService: AuthService) {}

  public getLoginFailure(): Observable<boolean> {
    return this.store.select(authQueries.selectLoginFailure);
  }

  public sendEmailConfirmationLink(): Observable<void> {
    return this.authService
      .getAuthState()
      .pipe(mergeMap((firebaseUser: firebase.User) => firebaseUser.sendEmailVerification()));
  }

  public login(credentials: CredentialsLogin) {
    this.store.dispatch(authActions.loginClearError());
    this.store.dispatch(authActions.login({ credentials }));
  }

  public logout() {
    this.store.dispatch(authActions.logout());
  }
}
