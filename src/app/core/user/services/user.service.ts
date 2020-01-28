import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTeam } from '../model/team-in-user.model';
import { User } from '../model/user.model';

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
        map((user: any) => {
          const teams: UserTeam[] = [];

          if (user.teams) {
            user.teams.forEach(team => {
              teams.push({ id: team.id, name: team.name, updated: new Date(team.updated.seconds * 1000) });
            });
          }

          return {
            id: uid,
            selectedTeamId: user.selectedTeamId,
            name: user.name,
            teams,
            email: user.email
          };
        })
      );
  }
}
