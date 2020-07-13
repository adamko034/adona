import { NewTeamMember } from 'src/app/core/team/model/requests/new-team/new-team-member.model';

export class NewTeamMemberBuilder {
  private member: NewTeamMember;

  private constructor(name: string) {
    this.member = { name };
  }

  public static from(name: string): NewTeamMemberBuilder {
    return new NewTeamMemberBuilder(name);
  }

  public withEmail(email: string): NewTeamMemberBuilder {
    this.member.email = email;
    return this;
  }

  public build(): NewTeamMember {
    return this.member;
  }
}
