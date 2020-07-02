import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';
import { teamQueries } from 'src/app/core/team/store/selectors/team.selectors';

@Injectable({ providedIn: 'root' })
export class TeamFacade {
  constructor(private store: Store) {}

  public loadTeam(id: string) {
    this.store.dispatch(teamsActions.team.loadTeamRequested({ id }));
  }

  public addTeam(request: NewTeamRequest) {
    this.store.dispatch(teamsActions.teams.newTeamRequested({ request }));
  }

  public selectTeam(): Observable<Team> {
    return this.store.pipe(select(teamQueries.selectTeam));
  }
}
