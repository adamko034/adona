import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UserFacade } from 'src/app/core/user/user.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class TeamLoadedGuard implements CanActivate {
  public constructor(private userFacade: UserFacade, private teamFacade: TeamsFacade) {}

  public canActivate(): Observable<boolean> {
    Logger.logDev('Selected Team Loaded Guard');
    return this.userFacade.selectUser().pipe(
      filter((user) => !!user),
      switchMap((user) => {
        this.teamFacade.loadTeam(user.selectedTeamId);
        return this.teamFacade.selectSelectedTeam();
      }),
      filter((team) => !!team),
      tap(() => Logger.logDev('Selected Team Loaded Guard: got team')),
      take(1),
      mapTo(true)
    );
  }
}
