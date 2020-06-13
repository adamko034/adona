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

  public isAtLeastOneMemberWithEmail(team: Team): boolean {
    return this.getMembersEmails(team).length > 0;
  }

  public getMembersEmails(team: Team): string[] {
    if (!team.members) {
      return [];
    }

    return Object.values(team.members)
      .filter((member) => !!member.email)
      .map((member) => member.email);
  }

  public getMembersEmailsWithout(team: Team, withoutEmail: string): string[] {
    if (!team.members) {
      return [];
    }

    return Object.values(team.members)
      .filter((member) => !!member.email && member.email !== withoutEmail)
      .map((member) => member.email);
  }
}
