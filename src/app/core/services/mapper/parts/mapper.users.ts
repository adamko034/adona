import { User } from 'src/app/core/auth/model/user-model';

export class UsersMapper {
  toUser(firebaseUser: firebase.User): User {
    const { uid, displayName, email, phoneNumber, photoURL } = firebaseUser;
    return { id: uid, displayName, email, phoneNumber, photoUrl: photoURL };
  }
}
