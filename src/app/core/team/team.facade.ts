import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { teamActions } from '../store/actions/team.actions';
import { TeamState } from '../store/reducers/team/team.reducer';
import { NewTeamRequest } from './model/new-team-request.model';

@Injectable({ providedIn: 'root' })
export class TeamFacade {
  constructor(private store: Store<TeamState>) {}

  public addTeam(request: NewTeamRequest) {
    this.store.dispatch(teamActions.newTeamRequested({ request }));
  }
}
