import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../model/user-model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly collectionName: string = 'users';

  constructor(private db: AngularFirestore) {}

  public getUser(uid: string): Observable<User> {
    return this.db
      .collection(this.collectionName)
      .doc(uid)
      .valueChanges()
      .pipe(
        take(1),
        map((user: any) => {
          return { id: uid, name: user.name, teams: user.teams, email: user.email };
        })
      );
  }
}
