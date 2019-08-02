import { Store } from '@ngrx/store';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AppState } from 'src/app/core/store/reducers';
import { GetAuthAction, LoginAction, LogoutAction } from '../store/actions/auth.actions';

export class AuthFacade {
  constructor(private store: Store<AppState>) {}

  public getAuth() {
    this.store.dispatch(new GetAuthAction());
  }

  public login(credentials: CredentialsLogin) {
    this.store.dispatch(new LoginAction(credentials));
  }

  public logout() {
    this.store.dispatch(new LogoutAction());
  }
}
