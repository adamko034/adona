import { Injectable } from '@angular/core';
import { UserTeam } from '../model/user-team.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserUtilservice {
  public hasMultipleTeams(user: User): boolean {
    return user && user.teams && user.teams.length > 1;
  }

  public getSelectedTeam(user: User): UserTeam {
    if (user && user.teams) {
      return user.teams.find((team: UserTeam) => team.id === user.selectedTeamId);
    }

    return null;
  }
}
