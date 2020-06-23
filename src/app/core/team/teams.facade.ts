import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';
import { teamsQueries } from 'src/app/core/team/store/selectors/teams.selectors';

@Injectable({ providedIn: 'root' })
export class TeamFacade {
  constructor(private store: Store) {}

  public loadSelectedTeam(id: string) {
    this.store.dispatch(teamsActions.selectedTeam.loadSelectedTeamRequested({ id }));
  }

  public loadTeam(id: string) {
    this.store.dispatch(teamsActions.teams.loadTeamRequested({ id }));
  }

  public addTeam(request: NewTeamRequest) {
    this.store.dispatch(teamsActions.teams.newTeamRequested({ request }));
  }

  public selectTeams(): Observable<Dictionary<Team>> {
    return this.store.pipe(select(teamsQueries.selectTeams));
  }

  public selectSelectedTeam(): Observable<Team> {
    return this.store.pipe(select(teamsQueries.selectSelectedTeam));
  }
}
