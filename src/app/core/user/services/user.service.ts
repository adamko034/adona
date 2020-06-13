import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, throwError } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { Logger } from 'src/app/shared/utils/logger/logger';
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

  public handleInvitation(user: User, invitation: Invitation): Observable<void> {
    Logger.logDev('user service, handle invitation, starting');
    if (!user.invitationId) {
      return throwError('Invitiation Id not set');
    }

    const teamDocRef = this.db.collection('teams').doc(invitation.teamId).ref;
    const invitationDocRef = this.db.collection('invitations').doc(invitation.id).ref;
    const userDocRef = this.db.collection(this.collectionName).doc(user.id).ref;

    const promise = this.db.firestore.runTransaction((transaction: firebase.firestore.Transaction) => {
      return transaction
        .get(teamDocRef)
        .then((teamDoc) => {
          const members: { [name: string]: TeamMember } = TeamMembersBuilder.fromTeamMembers(teamDoc.data().members)
            .upsertMemberFromUser(user)
            .build();
          transaction.update(teamDocRef, { members });

          return transaction;
        })
        .then((tran) => {
          return tran.update(invitationDocRef, { status: InvitationStatus.Accepted });
        })
        .then((tran) => {
          const newUserTeam = UserTeamBuilder.from(invitation.teamId, invitation.teamName, new Date()).build();
          const teams = [...user.teams, newUserTeam];
          tran.update(userDocRef, { teams });
        });
    });

    return from(promise.then());
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
      .withPhotoUrl(firebaseUser.photoURL)
      .withInvitationId(firebaseUser.invitationId)
      .build();
  }
}
