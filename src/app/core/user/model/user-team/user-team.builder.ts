import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';

export class UserTeamBuilder {
  private userTeam: UserTeam;

  private constructor(id: string, name: string) {
    this.userTeam = { id, name };
  }

  public static from(id: string, name: string): UserTeamBuilder {
    return new UserTeamBuilder(id, name);
  }

  public build(): UserTeam {
    return this.userTeam;
  }
}
