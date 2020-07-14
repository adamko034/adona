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

  public static fromTeam(team: Team): TeamBuilder {
    return new TeamBuilder(team.id, team.created, team.createdBy, team.name, team.members);
  }

  public withName(name: string): TeamBuilder {
    this.team.name = name;
    return this;
  }

  public build(): Team {
    return this.team;
  }
}
