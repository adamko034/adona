import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { LoginAction, LogoutAction, AuthenticatedAction } from '../store/actions/auth.actions';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { MapperService } from 'src/app/core/services/mapper/mapper.service';

export class AuthFacade {
  constructor(private store: Store<AuthState>, private mapper: MapperService) {}

  public authenticate(firebaseUser: firebase.User) {
    const user = this.mapper.Users.toUser(firebaseUser);
    this.store.dispatch(new AuthenticatedAction(user));
  }

  public isLoggedIn(): Observable<boolean> {
    return this.store.select(authQueries.selectLoggedIn);
  }

  public getLoginFailure(): Observable<boolean> {
    return this.store.select(authQueries.selectLoginFailure);
  }

  public login(credentials: CredentialsLogin) {
    this.store.dispatch(new LoginAction(credentials));
  }

  public logout() {
    this.store.dispatch(new LogoutAction());
  }
}
