import { User } from 'src/app/core/user/model/user.model';

export class UserTestBuilder {
  private user: User;

  public withDefaultData(): UserTestBuilder {
    this.user = {
      id: '1',
      name: 'test name'
    };

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
