import { Store } from '@ngrx/store';
import { CredentialsLogin } from 'src/app/shared/models/auth/credentials-login.model';
import { AppState } from 'src/app/store/reducers';
import {
  GetAuthAction,
  LoginAction,
  LogoutAction
} from './store/actions/auth.actions';
import { authQuery } from './store/selectors/auth.selectors';

export class AuthFacade {
  public auth$ = this.store.select(authQuery.getAuth);

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
