import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';
import { User } from 'src/app/core/user/model/user/user.model';

export class UserBuilder {
  private constructor(id: string, email: string, name: string, teams: UserTeam[], personalTeamId: string) {
    this.user = { id, email, name, teams, personalTeamId };
  }

  public static defaultPhotoUrl = '/assets/images/user.png';

  private user: User;

  public static from(id: string, email: string, name: string, teams: UserTeam[], personalTeamId: string): UserBuilder {
    return new UserBuilder(id, email, name, teams, personalTeamId);
  }

  public withPhotoUrl(photoUrl: string): UserBuilder {
    this.user.photoUrl = photoUrl;
    return this;
  }

  public withInvitationId(invitationId: string): UserBuilder {
    if (invitationId) {
      this.user.invitationId = invitationId;
    }

    return this;
  }

  public withSelectedTeamId(teamId: string): UserBuilder {
    this.user.selectedTeamId = teamId;
    return this;
  }

  public build(): User {
    return this.user;
  }
}
