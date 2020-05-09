import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';

export class NewTeamRequestBuilder {
  private request: NewTeamRequest;

  private constructor(name: string, createdBy: string, members: { [key: string]: TeamMember }) {
    this.request = {
      created: new Date(),
      createdBy,
      members,
      name
    };
  }

  public static from(name: string, createdBy: string, members: { [key: string]: TeamMember }): NewTeamRequestBuilder {
    return new NewTeamRequestBuilder(name, createdBy, members);
  }

  public build(): NewTeamRequest {
    return this.request;
  }
}
