import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamActions } from 'src/app/core/team/store/actions/team.actions';
import { TeamState } from 'src/app/core/team/store/reducers/team.reducer';
import { teamQueries } from 'src/app/core/team/store/selectors/team.selectors';

@Injectable({ providedIn: 'root' })
export class TeamFacade {
  constructor(private store: Store<TeamState>) {}

  public loadSelectedTeam() {
    this.store.dispatch(teamActions.loadSelectedTeamRequested());
  }

  public loadTeam(id: string) {
    this.store.dispatch(teamActions.loadTeamRequested({ id }));
  }

  public addTeam(request: NewTeamRequest) {
    this.store.dispatch(teamActions.newTeamRequested({ request }));
  }

  public selectTeams(): Observable<Dictionary<Team>> {
    return this.store.pipe(select(teamQueries.selectTeams));
  }

  public selectSelectedTeam(): Observable<Team> {
    return this.store.pipe(select(teamQueries.selectSelectedTeam));
  }
}
