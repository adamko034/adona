import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';
import { teamQueries } from 'src/app/core/team/store/selectors/teams.selectors';

@Injectable({ providedIn: 'root' })
export class TeamsFacade {
  constructor(private store: Store) {}

  public loadTeam(id: string) {
    this.store.dispatch(teamsActions.team.loadTeamRequested({ id }));
  }

  public loadSelectedTeam() {
    this.store.dispatch(teamsActions.team.loadSelectedTeamRequested());
  }

  public addTeam(request: NewTeamRequest) {
    this.store.dispatch(teamsActions.team.newTeamRequested({ request }));
  }

  public selectSelectedTeam(): Observable<Team> {
    return this.store.pipe(select(teamQueries.selectSelected));
  }

  public selectTeam(id: string): Observable<Team> {
    return this.store.pipe(select(teamQueries.selectOne, { id }));
  }

  public loadTeams(): void {
    this.store.dispatch(teamsActions.teams.loadTeamsRequested());
  }

  public selectTeams(): Observable<Team[]> {
    return this.store.pipe(select(teamQueries.selectAll));
  }

  public changeTeamName(request: TeamNameUpdateRequest): void {
    this.store.dispatch(teamsActions.team.updateNameRequested({ request }));
  }

  public deleteTeam(id: string): void {
    this.store.dispatch(teamsActions.team.deleteTeamRequested({ id }));
  }
}
