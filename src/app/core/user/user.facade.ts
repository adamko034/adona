import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { userQueries } from 'src/app/core/store/selectors/user.selectors';
import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';
import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';
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

  public changeTeam(teamId: string) {
    this.store.dispatch(userActions.changeTeamRequested({ teamId }));
  }

  public updateName(id: string, newName: string): void {
    this.store.dispatch(userActions.updateNameRequested({ id, newName }));
  }

  public updateTeamName(request: TeamNameUpdateRequest): void {
    this.store.dispatch(userActions.teamNameChanged({ request }));
  }

  public handleInvitation(user: User): void {
    this.store.dispatch(userActions.handleInvitationRequested({ user }));
  }

  public selectUserTeams(): Observable<UserTeam[]> {
    return this.store.select(userQueries.userTeams);
  }

  public deleteTeam(id: string): void {
    this.store.dispatch(userActions.teamDeleted({ id }));
  }
}
