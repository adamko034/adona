import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, mapTo, take, tap } from 'rxjs/operators';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UserFacade } from 'src/app/core/user/user.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class UserLoadedGuard implements CanActivate {
  constructor(private userFacade: UserFacade, private teamsFacade: TeamsFacade) {}

  public canActivate(): Observable<boolean> {
    return this.isUserLoaded();
  }

  private isUserLoaded(): Observable<boolean> {
    Logger.logDev('user loaded guard, waiting for user');
    return this.userFacade.selectUser().pipe(
      filter((user) => !!user),
      tap(() => Logger.logDev('user loaded guard, got user, loading selected team')),
      tap(() => this.teamsFacade.loadSelectedTeam()),
      mapTo(true),
      take(1)
    );
  }
}
