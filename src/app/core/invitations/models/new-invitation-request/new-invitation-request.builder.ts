import { InvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';

export class InvitationRequestBuilder {
  private request: InvitationRequest;

  private constructor(sender: string, teamId: string, teamName: string, recipients: string[]) {
    this.request = {
      sender,
      teamId,
      teamName,
      recipients
    };
  }

  public static from(sender: string, teamId: string, teamName: string, recipients: string[]): InvitationRequestBuilder {
    return new InvitationRequestBuilder(sender, teamId, teamName, recipients);
  }

  public build(): InvitationRequest {
    return this.request;
  }
}
