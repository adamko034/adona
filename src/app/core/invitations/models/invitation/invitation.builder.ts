import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';

export class InvitationBuilder {
  private invitation: Invitation;

  private constructor(id: string, recipientEmail: string, senderEmail: string, teamId: string, teamName: string) {
    this.invitation = {
      id,
      created: new Date(),
      recipientEmail,
      senderEmail,
      teamId,
      teamName,
      status: InvitationStatus.Requested
    };
  }

  public static from(
    id: string,
    recipientEmail: string,
    senderEmail: string,
    teamId: string,
    teamName: string
  ): InvitationBuilder {
    return new InvitationBuilder(id, recipientEmail, senderEmail, teamId, teamName);
  }

  public withStatus(status: InvitationStatus): InvitationBuilder {
    this.invitation.status = status;
    return this;
  }

  public withCreated(created: Date): InvitationBuilder {
    console.log('with created' + created);

    this.invitation.created = created;
    return this;
  }

  public build(): Invitation {
    return this.invitation;
  }
}
