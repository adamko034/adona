import { Injectable } from '@angular/core';
import { User } from '../model/user-model';
import { UserTeam } from '../model/user-team.model';

@Injectable({ providedIn: 'root' })
export class UserUtilservice {
  public hasTeams(user: User): boolean {
    return user && user.teams && user.teams.length > 0;
  }

  public belongsToTeam(user: User, teamName: string): boolean {
    return (
      user.teams &&
      user.teams.findIndex((team: UserTeam) => team.name.toLocaleLowerCase() === teamName.toLowerCase().trim()) >= 0
    );
  }
}
