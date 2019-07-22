import { User } from './../../models/auth/user-model';

export class FirebaseToAdonaLoginConverter {
  public static convert(firebaseLogin: any): User {
    const { uid, displayName, email, phoneNumber, photoURL } = firebaseLogin;
    return { id: uid, displayName, email, phoneNumber, photoUrl: photoURL };
  }
}
