import { Injectable } from '@angular/core';
import { TeamDto } from 'src/app/core/team/model/team/team-dto.model';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';

@Injectable({ providedIn: 'root' })
export class UserTeamFactory {
  public fromTeamDto(id: string, teamDto: TeamDto): UserTeam {
    return UserTeamBuilder.from(id, teamDto.name).build();
  }
}
