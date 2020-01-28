import { Injectable } from '@angular/core';
import { User } from '../model/user-model';

@Injectable({ providedIn: 'root' })
export class UserUtilservice {
  public hasMultipleTeams(user: User): boolean {
    return user && user.teams && this.teamsCount(user) > 1;
  }

  private teamsCount(user: User): number {
    if (user && user.teams) {
      return Object.keys(user.teams).length;
    }

    return 0;
  }
}
