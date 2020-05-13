import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { NewInvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamUtilsService } from 'src/app/core/team/services/team-utils.service';
import { User } from 'src/app/core/user/model/user.model';

@Injectable({ providedIn: 'root' })
export class InvitationsService {
  private readonly collectionName = 'invitations';
  constructor(private db: AngularFirestore, private teamUtilsService: TeamUtilsService) {}

  public addRequests(request: NewInvitationRequest): Observable<void> {
    const recipients: string[] = this.teamUtilsService.getMembersEmails(request.team);

    const batch = this.db.firestore.batch();
    recipients.forEach((recipient) => this.addRequest(request.sender, recipient, request.team, batch));

    return from(batch.commit());
  }

  private addRequest(sender: User, recipient: string, team: Team, batch: firebase.firestore.WriteBatch): void {
    const id = this.db.createId();
    const invitation = InvitationBuilder.from(id, recipient, sender.email, team.id, team.name).build();
    delete invitation.id;

    batch.set(this.db.firestore.collection(this.collectionName).doc(id), invitation);
  }
}
