import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FirebaseUtils } from '../../services/firebase-utils/firebase-utils.service';
import { UserTeam } from '../model/user-team.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly collectionName: string = 'users';

  constructor(private db: AngularFirestore, private firebaseUtils: FirebaseUtils) {}

  public getUser(uid: string): Observable<User> {
    return this.db
      .collection(this.collectionName)
      .doc(uid)
      .valueChanges()
      .pipe(
        take(1),
        map((firebaseUser: any) => this.mapFromFirebase(firebaseUser, uid))
      );
  }

  private mapFromFirebase(firebaseUser: any, uid: string): User {
    const teams: UserTeam[] = [];

    if (firebaseUser.teams) {
      firebaseUser.teams.forEach(team => {
        teams.push({ id: team.id, name: team.name, updated: this.firebaseUtils.convertToDate(team.updated) });
      });
    }

    return {
      id: uid,
      selectedTeamId: firebaseUser.selectedTeamId,
      name: firebaseUser.name,
      teams,
      email: firebaseUser.email
    };
  }
}
