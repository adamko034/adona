import { Injectable } from '@angular/core';
import { Team } from '../model/team.model';

@Injectable({ providedIn: 'root' })
export class TeamUtilsService {
  public getMembersCount(team: Team): number {
    if (!team || !team.members) {
      return 0;
    }

    return Object.keys(team.members).length;
  }
}
