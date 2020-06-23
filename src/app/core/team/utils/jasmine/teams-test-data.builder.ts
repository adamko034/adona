import { Dictionary } from '@ngrx/entity';
import { TeamMembersBuilder } from 'src/app/core/team/model/team-member/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';

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

  public buildOne(): Team {
    return this.teams['123'];
  }

  public build(): Dictionary<Team> {
    return this.teams;
  }
}
