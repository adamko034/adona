import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CredentialsLogin } from 'src/app/core/auth/model/credentials-login.model';
import { MapperService } from 'src/app/core/services/mapper/mapper.service';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { AuthenticatedAction, LoginAction, LogoutAction } from '../store/actions/auth.actions';
import { User } from './model/user-model';

@Injectable()
export class AuthFacade {
  constructor(private store: Store<AuthState>, private mapper: MapperService) {}

  public authenticate(firebaseUser: firebase.User) {
    const user = this.mapper.Users.toUser(firebaseUser);
    this.store.dispatch(new AuthenticatedAction(user));
  }

  public getUser(): Observable<User> {
    return this.store.select(authQueries.selectUser);
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
