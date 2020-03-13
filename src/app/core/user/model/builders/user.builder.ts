import { UserTeam } from '../user-team.model';
import { User } from '../user.model';

export class UserBuilder {
  private user: User;

  private constructor(id: string, name: string, email: string) {
    this.user = { id, name, email };
  }

  public static from(id: string, name: string, email: string): UserBuilder {
    return new UserBuilder(id, name, email);
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
