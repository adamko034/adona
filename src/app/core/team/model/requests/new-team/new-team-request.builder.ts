import { NewTeamMember } from 'src/app/core/team/model/requests/new-team/new-team-member.model';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';

export class NewTeamRequestBuilder {
  private request: NewTeamRequest;

  private constructor(name: string, members: NewTeamMember[]) {
    this.request = {
      created: new Date(),
      members,
      name
    };
  }

  public static from(name: string, members: NewTeamMember[]): NewTeamRequestBuilder {
    return new NewTeamRequestBuilder(name, members);
  }

  public build(): NewTeamRequest {
    return this.request;
  }
}
