import { UserTeam } from '../user-team.model';

export class UserTeamBuilder {
  private userTeam: UserTeam;

  private constructor(id: string, name: string, updated: Date) {
    this.userTeam = { id, name, updated };
  }

  public static from(id: string, name: string, updated: Date): UserTeamBuilder {
    return new UserTeamBuilder(id, name, updated);
  }

  public build(): UserTeam {
    return this.userTeam;
  }
}
