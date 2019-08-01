import { User } from '../../models/auth/user-model';
import { Injectable } from '@angular/core';

class UsersMapper {
  toUser(firebaseUser: firebase.User): User {
    const { uid, displayName, email, phoneNumber, photoURL } = firebaseUser;
    return { id: uid, displayName, email, phoneNumber, photoUrl: photoURL };
  }
}

@Injectable({
  providedIn: 'root'
})
export class MapperService {
  private usersMapper: UsersMapper;

  public get Users(): UsersMapper {
    return this.usersMapper;
  }

  constructor() {
    this.usersMapper = new UsersMapper();
  }
}
