import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { LoginAction, LogoutAction } from '../store/actions/auth.actions';

export class AuthFacade {
  constructor(private store: Store<AuthState>) {}

  public getLoginFailure(): Observable<boolean> {
    return this.store.select(authQueries.getLoginFailure);
  }

  public login(credentials: CredentialsLogin) {
    this.store.dispatch(new LoginAction(credentials));
  }

  public logout() {
    this.store.dispatch(new LogoutAction());
  }
}
