import { NewInvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { Team } from 'src/app/core/team/model/team.model';
import { User } from 'src/app/core/user/model/user.model';

export class NewInvitationRequestBuilder {
  private request: NewInvitationRequest;

  private constructor(sender: User, team: Team) {
    this.request = {
      sender,
      team
    };
  }

  public static from(sender: User, team: Team): NewInvitationRequestBuilder {
    return new NewInvitationRequestBuilder(sender, team);
  }

  public build(): NewInvitationRequest {
    return this.request;
  }
}
