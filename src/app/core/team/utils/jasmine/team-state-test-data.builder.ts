import { Dictionary } from '@ngrx/entity';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsState } from 'src/app/core/team/store/reducers/teams.reducer';

export class TeamStateTestDataBuilder {
  private teamState: TeamsState;

  private constructor() {
    this.teamState = {
      selected: null,
      entities: {},
      ids: []
    };
  }

  public static from(): TeamStateTestDataBuilder {
    return new TeamStateTestDataBuilder();
  }

  public withSelectedTeam(team: Team): TeamStateTestDataBuilder {
    this.teamState.selected = team;
    return this;
  }

  public withTeam(team: Team): TeamStateTestDataBuilder {
    this.teamState.ids.push(team.id as string & number);
    this.teamState.entities[team.id] = team;

    return this;
  }

  public withTeams(teams: Dictionary<Team>): TeamStateTestDataBuilder {
    for (const teamId in teams) {
      if (teams.hasOwnProperty(teamId)) {
        this.teamState.ids.push(teamId as string & number);
        this.teamState.entities[teamId] = teams[teamId];
      }
    }

    return this;
  }

  public build(): TeamsState {
    return this.teamState;
  }
}
