import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { UserTeamBuilder } from '../model/builders/user-team.builder';
import { UserBuilder } from '../model/builders/user.builder';
import { UserTeam } from '../model/user-team.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly collectionName: string = 'users';

  constructor(private db: AngularFirestore, private timeService: TimeService) {}

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
        teams.push(
          UserTeamBuilder.from(
            team.id,
            team.name,
            this.timeService.Creation.fromFirebaseTimestamp(team.updated)
          ).build()
        );
      });
    }

    return UserBuilder.from(uid, firebaseUser.name)
      .withSelectedTeamId(firebaseUser.selectedTeamId)
      .withTeams(teams)
      .build();
  }
}
