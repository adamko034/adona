import { User } from 'src/app/core/user/model/user.model';

export class UserTestBuilder {
  private user: User;

  public withDefaultData(): UserTestBuilder {
    this.user = {
      displayName: 'testUser',
      email: 'test@email.com',
      id: '1',
      phoneNumber: '123',
      photoUrl: 'url.com'
    };

    return this;
  }

  public build(): User {
    return this.user;
  }

  public buildFirebaseUser(): any {
    return {
      uid: this.user.id,
      displayName: this.user.displayName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      photoURL: this.user.photoUrl
    };
  }
}
