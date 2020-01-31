import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { teamActions } from '../store/actions/team.actions';
import { TeamState } from '../store/reducers/team/team.reducer';
import { teamQueries } from '../store/selectors/team.selectors';
import { ChangeTeamRequest } from './model/change-team-request.model';
import { NewTeamRequest } from './model/new-team-request.model';
import { Team } from './model/team.model';

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

  public changeTeam(request: ChangeTeamRequest) {
    this.store.dispatch(teamActions.changeTeamRequested({ request }));
  }

  public selectTeams(): Observable<Dictionary<Team>> {
    return this.store.pipe(select(teamQueries.selectTeams));
  }

  public selectSelectedTeam(): Observable<Team> {
    return this.store.pipe(select(teamQueries.selectSelectedTeam));
  }
}
