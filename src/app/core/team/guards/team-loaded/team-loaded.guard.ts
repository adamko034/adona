import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, flatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { TeamFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class TeamLoadedGuard implements CanActivate {
  public constructor(private userFacade: UserFacade, private teamFacade: TeamFacade) {}

  public canActivate(): Observable<boolean> {
    return combineLatest([this.loadTeam(), this.waitForTeam()]).pipe(mapTo(true));
  }

  private loadTeam(): Observable<void> {
    Logger.logDev('Selected Team Loaded Guard: load team');
    return this.userFacade.selectUser().pipe(
      filter((user) => !!user),
      take(1),
      map((user: User) => this.teamFacade.loadTeam(user.selectedTeamId))
    );
  }

  private waitForTeam(): Observable<void> {
    Logger.logDev('Selected Team Loaded Guard: waiting for team');
    return this.teamFacade.selectTeam().pipe(
      filter((team) => !!team),
      take(1),
      tap(() => Logger.logDev('Selected Team Loaded Guard: waiting for team, got one!')),
      flatMap(() => of(undefined))
    );
  }
}
