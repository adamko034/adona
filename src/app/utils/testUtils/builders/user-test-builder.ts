import { User } from 'src/app/core/user/model/user.model';

export class UserTestBuilder {
  private user: User;

  private constructor(id: string, name: string) {
    this.user = { id, name };
  }

  public static with(id: string, name: string): UserTestBuilder {
    return new UserTestBuilder(id, name);
  }

  public static withDefaultData(): UserTestBuilder {
    return new UserTestBuilder('1', 'test user');
  }

  public withSelectedTeamId(teamId: string) {
    this.user.selectedTeamId = teamId;
    return this;
  }

  public build(): User {
    return this.user;
  }

  public buildFirebaseUser(): any {
    return {
      uid: this.user.id,
      name: this.user.name
    };
  }
}
