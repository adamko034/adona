import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AppState } from 'src/app/core/store/reducers';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQuery } from 'src/app/core/store/selectors/auth.selectors';
import { LoginAction, LogoutAction } from '../store/actions/auth.actions';

export class AuthFacade {
  constructor(private store: Store<AppState>) {}

  public getAuth(): Observable<AuthState> {
    return this.store.select(authQuery.getAuth);
  }

  public getLoginFailure(): Observable<boolean> {
    return this.store.select(authQuery.getLoginFailure);
  }

  public login(credentials: CredentialsLogin) {
    this.store.dispatch(new LoginAction(credentials));
  }

  public logout() {
    this.store.dispatch(new LogoutAction());
  }
}
