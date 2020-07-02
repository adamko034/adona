import { TeamDto } from 'src/app/core/team/model/team/team-dto.model';

export class TeamDtoBuilder {
  private team: TeamDto;

  private constructor(private name: string, private created: Date, private createdByUid: string) {
    this.team = { name, created, createdByUid };
  }

  public static from(name: string, created: Date, createdByUid: string): TeamDtoBuilder {
    return new TeamDtoBuilder(name, created, createdByUid);
  }

  public build(): TeamDto {
    return this.team;
  }
}
