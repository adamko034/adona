import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { authActions } from '../store/actions/auth.actions';
import { User } from '../user/model/user-model';

@Injectable()
export class AuthFacade {
  constructor(private store: Store<AuthState>) {}

  public getUser(): Observable<User> {
    return this.store.select(authQueries.selectUser);
  }

  public findUser(id: string) {
    return this.store.dispatch(authActions.findUser({ id }));
  }

  public getLoginFailure(): Observable<boolean> {
    return this.store.select(authQueries.selectLoginFailure);
  }

  public login(credentials: CredentialsLogin) {
    this.store.dispatch(authActions.login({ credentials }));
  }

  public logout() {
    this.store.dispatch(authActions.logout());
  }
}
