import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app/';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly teamsCollectionName = 'teams';
  private readonly usersCollectionName = 'users';
  constructor(private db: AngularFirestore, private timeService: TimeService) {}

  public addTeam(request: NewTeamRequest, uid: string): Observable<Team | any> {
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

    return from(
      batch.commit().then(
        () => teamToAdd,
        (error) => new Error(error)
      )
    );
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
