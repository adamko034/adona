import { UserDto } from 'src/app/core/user/model/user/user-dto.model';

export class UserDtoBuilder {
  private user: UserDto;

  private constructor(name: string, email: string, photoUrl: string, selectedTeamId: string, teams: string[]) {
    this.user = { name, email, selectedTeamId, teams, photoUrl };
  }

  public static from(
    name: string,
    email: string,
    photoUrl: string,
    selectedTeamId: string,
    teams: string[]
  ): UserDtoBuilder {
    return new UserDtoBuilder(name, email, photoUrl, selectedTeamId, teams);
  }

  public withInvitationId(id: string): UserDtoBuilder {
    if (id) {
      this.user.invitationId = id;
    }

    return this;
  }

  public build(): UserDto {
    return this.user;
  }
}
