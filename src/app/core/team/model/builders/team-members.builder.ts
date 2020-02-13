import { TeamMember } from '../team-member.model';

export class TeamMembersBuilder {
  private members: { [name: string]: TeamMember };

  private constructor() {
    this.members = {};
  }

  public static from(): TeamMembersBuilder {
    return new TeamMembersBuilder();
  }

  public withMember(name: string): TeamMembersBuilder {
    this.members[name] = { name };
    return this;
  }

  public build(): { [name: string]: TeamMember } {
    return this.members;
  }
}
