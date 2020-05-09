import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';

export class TeamMembersBuilder {
  private members: { [name: string]: TeamMember };

  private constructor() {
    this.members = {};
  }

  public static from(): TeamMembersBuilder {
    return new TeamMembersBuilder();
  }

  public withMember(name: string, photoUrl: string, email?: string): TeamMembersBuilder {
    this.members[name] = { name, photoUrl, email };
    return this;
  }

  public build(): { [name: string]: TeamMember } {
    return this.members;
  }
}
