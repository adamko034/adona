import { Injectable } from '@angular/core';
import { TeamDtoBuilder } from 'src/app/core/team/model/team/team-dto.builder';
import { TeamDto } from 'src/app/core/team/model/team/team-dto.model';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { resources } from 'src/app/shared/resources/resources';
import { TimeService } from 'src/app/shared/services/time/time.service';

@Injectable({ providedIn: 'root' })
export class TeamFactory {
  constructor(private timeService: TimeService) {}

  public personalTeamDto(userId: string): TeamDto {
    return TeamDtoBuilder.from(resources.team.personalTeamName, new Date(), userId).build();
  }

  public fromFirebase(firebaseTeam: any): Team {
    return TeamBuilder.from(
      firebaseTeam.id,
      this.timeService.Creation.fromFirebaseTimestamp(firebaseTeam.created),
      firebaseTeam.createdBy,
      firebaseTeam.name,
      firebaseTeam.members
    ).build();
  }
}
