import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { User } from 'src/app/core/user/model/user/user.model';

export class TeamMemberBuilder {
  private member: TeamMember;

  private constructor(name: string, photoUrl: string) {
    this.member = { name, photoUrl };
  }

  public static from(name: string, photoUrl: string): TeamMemberBuilder {
    return new TeamMemberBuilder(name, photoUrl);
  }

  public static fromUser(user: User): TeamMemberBuilder {
    return new TeamMemberBuilder(user.name, user.photoUrl);
  }

  public withId(id: string): TeamMemberBuilder {
    this.member.id = id;
    return this;
  }

  public build(): TeamMember {
    return this.member;
  }
}
