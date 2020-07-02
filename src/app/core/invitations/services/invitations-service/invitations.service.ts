import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';
import { InvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class InvitationsService {
  private readonly collectionName = 'invitations';
  constructor(private db: AngularFirestore, private timeService: TimeService) {}

  public addInvitation(request: InvitationRequest): Observable<void> {
    const batch = this.db.firestore.batch();
    request.recipients.forEach((recipient) =>
      this.addRequest(request.sender, recipient, request.teamId, request.teamName, batch)
    );

    return from(batch.commit());
  }

  public get(id: string): Observable<Invitation> {
    Logger.logDev('invitation service, get, id:' + id);
    return this.db
      .collection(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(
        take(1),
        map((invitation: any) => {
          Logger.logDev('invitation service, got invitation: ' + id);
          const { recipientEmail, senderEmail, teamId, teamName, created, status } = invitation;

          return InvitationBuilder.from(id, recipientEmail, senderEmail, teamId, teamName)
            .withCreated(this.timeService.Creation.fromFirebaseTimestamp(created))
            .withStatus(status)
            .build();
        })
      );
  }

  private addRequest(
    sender: string,
    recipient: string,
    teamId: string,
    teamName: string,
    batch: firebase.firestore.WriteBatch
  ): void {
    const id = this.db.createId() + this.db.createId();
    const invitation = InvitationBuilder.from(id, recipient, sender, teamId, teamName).build();
    delete invitation.id;

    batch.set(this.db.firestore.collection(this.collectionName).doc(id), invitation);
  }
}
