import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { User } from '../../user/model/user-model';
import { ChangeTeamRequest } from '../model/change-team-request.model';
import { NewTeamRequest } from '../model/new-team-request.model';
import { Team } from '../model/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly teamsCollectionName = 'teams';
  private readonly usersCollectionName = 'users';
  constructor(private db: AngularFirestore) {}

  public addTeam(request: NewTeamRequest, user: User): Observable<Team> {
    const teamToAdd: Team = {
      id: this.db.createId(),
      createdBy: request.createdBy,
      members: request.members,
      name: request.name
    };

    const batch = this.db.firestore.batch();

    batch.set(this.db.firestore.collection(this.teamsCollectionName).doc(teamToAdd.id), teamToAdd);
    batch.update(this.db.firestore.collection(this.usersCollectionName).doc(user.id), {
      selectedTeamId: teamToAdd.id,
      [`teams.${teamToAdd.id}`]: { name: teamToAdd.name }
    });

    return from(batch.commit().then(() => teamToAdd));
  }

  public changeTeam(request: ChangeTeamRequest): Observable<string> {
    const promise = this.db
      .collection(this.usersCollectionName)
      .doc(request.uid)
      .update({ selectedTeamId: request.teamId });

    return from(promise.then(() => request.teamId));
  }
}
