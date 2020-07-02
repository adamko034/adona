import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { from, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';
import { storeConstants } from 'src/app/core/store/constants/store.constants';
import { ChangeTeamRequest } from 'src/app/core/team/model/change-team-requset/change-team-request.model';
import { TeamFactory } from 'src/app/core/team/services/factory/team.factory';
import { UserFactory } from 'src/app/core/user/factories/user/user.factory';
import { User } from 'src/app/core/user/model/user/user.model';
import { firebaseConstants } from 'src/app/shared/constants/firebase/firebase-functions.constant';

@Injectable({ providedIn: 'root' })
export class UserService {
  public constructor(
    private db: AngularFirestore,
    private teamFactory: TeamFactory,
    private userFactory: UserFactory,
    private functions: AngularFireFunctions
  ) {}

  public createUser(firebaseAuth: firebase.User, invitationId: string): Observable<void> {
    const { uid } = firebaseAuth;
    const teamId = this.db.createId();
    const team = this.teamFactory.personalTeamDto(uid);
    const user = this.userFactory.dtofromFirebaseAuth(firebaseAuth, invitationId, teamId);

    const batch = this.db.firestore.batch();

    batch.set(this.db.firestore.collection(storeConstants.collections.users).doc(uid), user);
    batch.set(this.db.firestore.collection(storeConstants.collections.teams).doc(teamId), team);
    batch.set(this.db.firestore.collection(storeConstants.collections.teamMembers).doc(teamId), {
      [uid]: { assigned: true, isVirtual: false }
    });

    return from(batch.commit());
  }

  public loadUser(): Observable<User> {
    const callable = this.functions.httpsCallable(firebaseConstants.functions.user.get);
    return callable({}).pipe(map((user) => this.userFactory.fromFirebaseUser(user)));
  }

  public changeTeam(request: ChangeTeamRequest): Observable<void> {
    const promise = this.db
      .collection(storeConstants.collections.users)
      .doc(request.userId)
      .update({ selectedTeamId: request.teamId });

    return from(promise.then());
  }

  public updateName(uid: string, newName: string): Observable<string> {
    const promise = this.db.collection(storeConstants.collections.users).doc(uid).update({ name: newName });
    return from(promise.then(() => newName));
  }

  public handleInvitation(user: User, invitation: Invitation): Observable<void> {
    if (!user.invitationId) {
      return throwError('Invitiation Id not set');
    }

    const teams = [...user.teams.map((team) => team.id), invitation.teamId];

    const batch = this.db.firestore.batch();

    batch.update(this.db.firestore.collection(storeConstants.collections.invitations).doc(invitation.id), {
      status: InvitationStatus.Accepted
    });
    batch.update(this.db.firestore.collection(storeConstants.collections.users).doc(user.id), {
      invitationId: null,
      teams
    });
    batch.update(this.db.firestore.collection(storeConstants.collections.teamMembers).doc(invitation.teamId), {
      [user.id]: { assigned: true, isVirtual: false }
    });

    return from(batch.commit());
  }
}
