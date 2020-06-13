import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { User } from 'src/app/core/user/model/user.model';

export class TeamMembersBuilder {
  private members: { [name: string]: TeamMember };

  private constructor(members?: { [name: string]: TeamMember }) {
    this.members = members || {};
  }

  public static from(): TeamMembersBuilder {
    return new TeamMembersBuilder();
  }

  public static fromTeamMembers(members: { [name: string]: TeamMember }): TeamMembersBuilder {
    return new TeamMembersBuilder({ ...members });
  }

  public withMember(name: string, photoUrl: string, email?: string): TeamMembersBuilder {
    this.members[name] = { name, photoUrl, email: email || null };
    return this;
  }

  public upsertMemberFromUser(user: User): TeamMembersBuilder {
    if (this.members[user.email]) {
      delete this.members[user.email];
    }

    this.members[user.name] = TeamMemberBuilder.fromUser(user).build();
    return this;
  }

  public build(): { [name: string]: TeamMember } {
    return this.members;
  }
}
