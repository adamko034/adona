import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { Team } from 'src/app/core/team/model/team/team.model';

export class TeamBuilder {
  private team: Team;

  private constructor(id: string, created: Date, createdBy: string, name: string, members: TeamMember[]) {
    this.team = { id, created, createdBy, name, members };
  }

  public static from(id: string, created: Date, createdBy: string, name: string, members: TeamMember[]) {
    return new TeamBuilder(id, created, createdBy, name, members);
  }

  public build(): Team {
    return this.team;
  }
}
