import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userActions } from '../store/actions/user.actions';
import { AuthState } from '../store/reducers/auth/auth.reducer';
import { userQueries } from '../store/selectors/user.selectors';
import { User } from './model/user-model';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  constructor(private store: Store<AuthState>) {}

  public getUser(): Observable<User> {
    return this.store.select(userQueries.selectUser);
  }

  public findUser(id: string) {
    return this.store.dispatch(userActions.findUser({ id }));
  }
}
