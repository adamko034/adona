import { UserTeamBuilder } from 'src/app/core/user/model/builders/user-team.builder';
import { User } from 'src/app/core/user/model/user.model';
import { UserTeam } from '../../../core/user/model/user-team.model';
import { DateTestBuilder } from './date-test.builder';

export class UserTestBuilder {
  private user: User;

  private constructor(id: string, name: string) {
    this.user = { id, name, email: 'ex@example.com' };
  }

  public static with(id: string, name: string): UserTestBuilder {
    return new UserTestBuilder(id, name);
  }

  public static withDefaultData(): UserTestBuilder {
    return new UserTestBuilder('1', 'test user');
  }

  public withDefaultUserTeam(): UserTestBuilder {
    if (!this.user.teams) {
      this.user.teams = [];
    }

    this.user.teams.push(UserTeamBuilder.from('123', 'test team', new Date()).build());

    return this;
  }

  public withDefaultUserTeams(count: number): UserTestBuilder {
    if (!this.user.teams) {
      this.user.teams = [];
    }

    for (let i = 1; i <= count; i++) {
      const userTeam = UserTeamBuilder.from(
        `123${i}`,
        `test team loop ${i}`,
        DateTestBuilder.now()
          .addDays(i * -1)
          .build()
      ).build();
      this.user.teams.push(userTeam);
    }

    return this;
  }

  public withUserTeam(userTeam: UserTeam): UserTestBuilder {
    if (!this.user.teams) {
      this.user.teams = [];
    }

    if (!!userTeam) {
      this.user.teams.push(userTeam);
    }

    return this;
  }

  public withSelectedTeamId(teamId: string) {
    this.user.selectedTeamId = teamId;
    return this;
  }

  public withUserTeams(userTeams: UserTeam[]): UserTestBuilder {
    if (!this.user.teams) {
      this.user.teams = [];
    }

    if (!!userTeams) {
      userTeams.forEach(team => this.user.teams.push(team));
    }

    return this;
  }

  public build(): User {
    return this.user;
  }

  public buildFirebaseUser(): any {
    return {
      uid: this.user.id,
      name: this.user.name,
      teams: !!this.user.teams ? this.user.teams : undefined,
      selectedTeamId: this.user.selectedTeamId
    };
  }
}
