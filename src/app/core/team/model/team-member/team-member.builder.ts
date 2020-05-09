import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';

export class TeamMemberBuilder {
  private member: TeamMember;

  private constructor(name: string) {
    this.member = { name };
  }

  public static from(name: string): TeamMemberBuilder {
    return new TeamMemberBuilder(name);
  }

  public withEmailAddress(email: string): TeamMemberBuilder {
    this.member.email = email;
    return this;
  }

  public withPhotoUrl(photoUrl: string): TeamMemberBuilder {
    this.member.photoUrl = photoUrl;
    return this;
  }

  public build(): TeamMember {
    if (!this.member.photoUrl) {
      this.member.photoUrl = UserBuilder.defaultPhotoUrl;
    }

    return this.member;
  }
}
