import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';
import { User } from 'src/app/core/user/model/user.model';

export class TeamMemberBuilder {
  private member: TeamMember;

  private constructor(name: string) {
    this.member = { name };
  }

  public static from(name: string): TeamMemberBuilder {
    return new TeamMemberBuilder(name);
  }

  public static fromUser(user: User): TeamMemberBuilder {
    return new TeamMemberBuilder(user.name).withEmailAddress(user.email).withPhotoUrl(user.photoUrl);
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
