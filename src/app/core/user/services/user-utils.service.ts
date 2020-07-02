import { Injectable } from '@angular/core';
import { User } from 'src/app/core/user/model/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserUtilservice {
  public hasMultipleTeams(user: User): boolean {
    if (!user || !user.teams) {
      return false;
    }

    return user.teams.length > 1;
  }

  public extractUsernameFromEmail(email: string): string {
    if (!email) {
      return '';
    }

    const matches = email.match(/^([^@]*)@/);

    if (!matches) {
      return '';
    }

    return matches[1];
  }
}
