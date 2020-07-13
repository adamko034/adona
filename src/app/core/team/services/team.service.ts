import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { storeConstants } from 'src/app/core/store/constants/store.constants';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamFactory } from 'src/app/core/team/services/factory/team.factory';
import { User } from 'src/app/core/user/model/user/user.model';
import { firebaseConstants } from 'src/app/shared/constants/firebase/firebase-functions.constant';

@Injectable({ providedIn: 'root' })
export class TeamService {
  public constructor(
    private db: AngularFirestore,
    private functions: AngularFireFunctions,
    private teamFactory: TeamFactory
  ) {}

  public addTeam(user: User, request: NewTeamRequest): Observable<string> {
    const teamId = this.db.createId();
    const team = { created: request.created, name: request.name, createdByUid: user.id };
    const teams = user.teams.map((t) => t.id);

    const virtualUsers = request.members
      .filter((m) => !m.email)
      .map((v) => {
        return {
          id: this.db.createId(),
          name: v.name
        };
      });
    const teamMembers: { [id: string]: { assigned: boolean; isVirtual: boolean } } = {};
    virtualUsers.forEach((v) => (teamMembers[v.id] = { assigned: true, isVirtual: true }));
    teamMembers[user.id] = { assigned: true, isVirtual: false };

    const batch = this.db.firestore.batch();
    virtualUsers.forEach((v) => {
      batch.set(this.db.firestore.collection(storeConstants.collections.virtualUsers).doc(v.id), { name: v.name });
    });

    batch.set(this.db.firestore.collection(storeConstants.collections.teams).doc(teamId), team);
    batch.set(this.db.firestore.collection(storeConstants.collections.teamMembers).doc(teamId), teamMembers);
    batch.update(this.db.firestore.collection(storeConstants.collections.users).doc(user.id), {
      teams: [...teams, teamId]
    });

    return from(batch.commit().then(() => teamId));
  }

  public getTeam(id: string): Observable<Team> {
    const callable = this.functions.httpsCallable(firebaseConstants.functions.team.get);
    return callable({ id }).pipe(map((team) => this.teamFactory.singleFromFirebase(team)));
  }

  public updateName(id: string, name: string): Observable<void> {
    return from(this.db.collection(storeConstants.collections.teams).doc(id).update({ name }));
  }

  public getAll(): Observable<Team[]> {
    const callable = this.functions.httpsCallable(firebaseConstants.functions.team.getAll);
    return callable({}).pipe(map((teams) => this.teamFactory.listFromFirebase(teams)));
  }
}
