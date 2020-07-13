import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { userQueries } from 'src/app/core/store/selectors/user.selectors';
import { ChangeTeamRequest } from 'src/app/core/team/model/requests/change-team/change-team-request.model';
import { User } from 'src/app/core/user/model/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  constructor(private store: Store<AuthState>) {}

  public selectUser(): Observable<User> {
    return this.store.select(userQueries.user);
  }

  public selectUserId(): Observable<string> {
    return this.store.select(userQueries.userId);
  }

  public loadUser() {
    return this.store.dispatch(userActions.loadUserRequested());
  }

  public changeTeam(request: ChangeTeamRequest) {
    this.store.dispatch(userActions.changeTeamRequested({ request }));
  }

  public updateName(id: string, newName: string): void {
    this.store.dispatch(userActions.updateNameRequested({ id, newName }));
  }

  public handleInvitation(user: User): void {
    this.store.dispatch(userActions.handleInvitationRequested({ user }));
  }
}
