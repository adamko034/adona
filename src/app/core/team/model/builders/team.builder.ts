import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { Team } from '../team.model';

export class TeamBuilder {
  private team: Team;

  private constructor(id: string, created: Date, createdBy: string, name: string) {
    this.team = { id, created, createdBy, name, members: {} };
  }

  public static from(id: string, created: Date, createdBy: string, name: string) {
    return new TeamBuilder(id, created, createdBy, name);
  }

  public withMembers(members: { [name: string]: TeamMember }): TeamBuilder {
    this.team.members = members;
    return this;
  }

  public build(): Team {
    return this.team;
  }
}
