import { Dictionary } from '@ngrx/entity';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { TeamMembersBuilder } from '../../model/builders/team-members.builder';
import { TeamBuilder } from '../../model/builders/team.builder';
import { Team } from '../../model/team.model';

export class TeamsTestDataBuilder {
  private teams: Dictionary<Team>;

  private constructor() {
    this.teams = {
      123: TeamBuilder.from('123', DateTestBuilder.now().addSeconds(-10).build(), 'test user', 'new team')
        .withMembers(TeamMembersBuilder.from().withMember('test user', 'photourl').build())
        .build(),
      124: TeamBuilder.from('124', DateTestBuilder.now().addSeconds(-30).build(), 'test user 2', 'team 2')
        .withMembers(
          TeamMembersBuilder.from().withMember('test user 2', 'photourl').withMember('test user', 'photourl').build()
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
