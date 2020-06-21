import { Dictionary } from '@ngrx/entity';
import { TeamState } from 'src/app/core/store/reducers/team/team.reducer';
import { Team } from 'src/app/core/team/model/team/team.model';

export class TeamStateTestDataBuilder {
  private teamState: TeamState;

  private constructor() {
    this.teamState = {
      entities: {},
      ids: []
    };
  }

  public static from(): TeamStateTestDataBuilder {
    return new TeamStateTestDataBuilder();
  }

  public withTeam(team: Team): TeamStateTestDataBuilder {
    this.teamState.ids.push(team.id as string & number);
    this.teamState.entities[team.id] = team;

    return this;
  }

  public withTeams(teams: Dictionary<Team>): TeamStateTestDataBuilder {
    for (const teamId in teams) {
      this.teamState.ids.push(teamId as string & number);
      this.teamState.entities[teamId] = teams[teamId];
    }

    return this;
  }

  public build(): TeamState {
    return this.teamState;
  }
}
