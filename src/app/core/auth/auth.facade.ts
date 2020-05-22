import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Credentials } from 'src/app/core/auth/model/credentials.model';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { authActions } from '../store/actions/auth.actions';

@Injectable()
export class AuthFacade {
  constructor(private store: Store<AuthState>) {}

  public selectLoginFailure(): Observable<boolean> {
    return this.store.select(authQueries.selectLoginFailure);
  }

  public login(credentials: Credentials, invitationId: string) {
    this.store.dispatch(authActions.loginClearError());
    this.store.dispatch(authActions.login({ credentials, invitationId }));
  }

  public logout() {
    this.store.dispatch(authActions.logout());
  }
}
