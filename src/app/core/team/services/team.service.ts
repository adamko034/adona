import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app/';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { TeamBuilder } from '../model/builders/team.builder';
import { ChangeTeamRequest } from '../model/change-team-request.model';
import { NewTeamRequest } from '../model/new-team-request.model';
import { Team } from '../model/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly teamsCollectionName = 'teams';
  private readonly usersCollectionName = 'users';
  constructor(private db: AngularFirestore, private timeService: TimeService) {}

  public addTeam(request: NewTeamRequest, uid: string): Observable<Team> {
    const teamToAdd: Team = TeamBuilder.from(this.db.createId(), request.created, request.createdBy, request.name)
      .withMembers(request.members)
      .build();

    const batch = this.db.firestore.batch();

    batch.set(this.db.firestore.collection(this.teamsCollectionName).doc(teamToAdd.id), teamToAdd);
    batch.update(this.db.firestore.collection(this.usersCollectionName).doc(uid), {
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

  public loadTeam(id: string): Observable<Team> {
    return this.db
      .collection(this.teamsCollectionName)
      .doc(id)
      .valueChanges()
      .pipe(
        take(1),
        map((team: any) => {
          return TeamBuilder.from(
            team.id,
            this.timeService.Creation.fromFirebaseTimestamp(team.created),
            team.createdBy,
            team.name
          )
            .withMembers(team.members)
            .build();
        })
      );
  }
}
