import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { UserTeamBuilder } from '../model/builders/user-team.builder';
import { UserBuilder } from '../model/builders/user.builder';
import { UserTeam } from '../model/user-team.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly collectionName: string = 'users';

  constructor(private db: AngularFirestore, private timeService: TimeService) {}

  public createUser(user: User): Observable<void> {
    return from(this.db.collection(this.collectionName).doc(user.id).set(user));
  }

  public loadUser(uid: string): Observable<User> {
    return this.db
      .collection(this.collectionName)
      .doc(uid)
      .valueChanges()
      .pipe(
        take(1),
        map((firebaseUser: any) => this.mapFromFirebase(firebaseUser, uid))
      );
  }

  public changeTeam(request: ChangeTeamRequest): Observable<void> {
    const teams = request.user.teams.map((team) => {
      if (team.id === request.teamId) {
        return { ...team, updated: request.updated };
      }

      return team;
    });

    const promise = this.db
      .collection(this.collectionName)
      .doc(request.user.id)
      .update({ selectedTeamId: request.teamId, teams });

    return from(promise.then());
  }

  public updateName(uid: string, newName: string): Observable<string> {
    const promise = this.db.collection(this.collectionName).doc(uid).update({ name: newName });

    return from(promise.then(() => newName));
  }

  private mapFromFirebase(firebaseUser: any, uid: string): User {
    const teams: UserTeam[] = [];

    if (firebaseUser.teams) {
      firebaseUser.teams.forEach((team) => {
        teams.push(
          UserTeamBuilder.from(
            team.id,
            team.name,
            this.timeService.Creation.fromFirebaseTimestamp(team.updated)
          ).build()
        );
      });
    }

    return UserBuilder.from(uid, firebaseUser.email, firebaseUser.name)
      .withName(firebaseUser.name)
      .withSelectedTeamId(!!firebaseUser.selectedTeamId ? firebaseUser.selectedTeamId : null)
      .withTeams(teams)
      .withPhotoUrl(firebaseUser.photoUrl)
      .build();
  }
}
