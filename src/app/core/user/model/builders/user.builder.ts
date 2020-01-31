import { UserTeam } from '../user-team.model';
import { User } from '../user.model';

export class UserBuilder {
  private user: User;

  private constructor(id: string, name: string) {
    this.user = { id, name };
  }

  public static from(id: string, name: string): UserBuilder {
    return new UserBuilder(id, name);
  }

  public withSelectedTeamId(value: string): UserBuilder {
    this.user.selectedTeamId = value;
    return this;
  }

  public withTeams(value: UserTeam[]): UserBuilder {
    this.user.teams = value;
    return this;
  }

  public build(): User {
    return this.user;
  }
}
