import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app/';
import { from, Observable } from 'rxjs';
import { User } from '../../user/model/user.model';
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
      created: request.created,
      createdBy: request.createdBy,
      members: request.members,
      name: request.name
    };

    const batch = this.db.firestore.batch();

    batch.set(this.db.firestore.collection(this.teamsCollectionName).doc(teamToAdd.id), teamToAdd);
    batch.update(this.db.firestore.collection(this.usersCollectionName).doc(user.id), {
      selectedTeamId: teamToAdd.id,
      teams: firebase.firestore.FieldValue.arrayUnion({
        id: teamToAdd.id,
        name: teamToAdd.name,
        updated: teamToAdd.created
      })
    });

    return from(batch.commit().then(() => teamToAdd));
  }

  public changeTeam(request: ChangeTeamRequest): Observable<ChangeTeamRequest> {
    const teams = request.user.teams.map(team => {
      if (team.id === request.teamId) {
        return { ...team, updated: request.updated };
      }

      return team;
    });

    const promise = this.db
      .collection(this.usersCollectionName)
      .doc(request.user.id)
      .update({ selectedTeamId: request.teamId, teams });

    return from(promise.then(() => request));
  }
}
