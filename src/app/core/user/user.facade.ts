import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userActions } from '../store/actions/user.actions';
import { AuthState } from '../store/reducers/auth/auth.reducer';
import { userQueries } from '../store/selectors/user.selectors';
import { ChangeTeamRequest } from '../team/model/change-team-request.model';
import { User } from './model/user.model';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  constructor(private store: Store<AuthState>) {}

  public selectUser(): Observable<User> {
    return this.store.select(userQueries.selectUser);
  }

  public selectUserId(): Observable<string> {
    return this.store.select(userQueries.selectUserId);
  }

  public loadUser(id: string) {
    return this.store.dispatch(userActions.loadUserRequested({ id }));
  }

  public changeTeam(request: ChangeTeamRequest) {
    this.store.dispatch(userActions.changeTeamRequested({ request }));
  }

  public updateName(id: string, newName: string): void {
    this.store.dispatch(userActions.updateNameRequested({ id, newName }));
  }
}
