import { Dictionary } from '@ngrx/entity';
import { TeamMembersBuilder } from '../../model/builders/team-members.builder';
import { TeamBuilder } from '../../model/builders/team.builder';
import { Team } from '../../model/team.model';

export class TeamsTestDataBuilder {
  private teams: Dictionary<Team>;

  private constructor() {
    this.teams = {
      123: TeamBuilder.from('123', new Date(), 'test user', 'new team')
        .withMembers(
          TeamMembersBuilder.from()
            .withMember('test user')
            .build()
        )
        .build(),
      124: TeamBuilder.from('124', new Date(), 'test user 2', 'team 2')
        .withMembers(
          TeamMembersBuilder.from()
            .withMember('test user 2')
            .withMember('test user')
            .build()
        )
        .build()
    };
  }

  public static withDefaultData(): TeamsTestDataBuilder {
    return new TeamsTestDataBuilder();
  }

  public static get firstTeamId() {
    return '123';
  }

  public addTeam(team: Team): TeamsTestDataBuilder {
    this.teams[team.id] = team;

    return this;
  }

  public build(): Dictionary<Team> {
    return this.teams;
  }
}
