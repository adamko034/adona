import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, flatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { TeamFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class SelectedTeamLoadedGuard implements CanActivate {
  public constructor(private userFacade: UserFacade, private teamFacade: TeamFacade) {}

  public canActivate(): Observable<boolean> {
    return combineLatest([this.loadSelectedTeam(), this.waitForSelectedTeam()]).pipe(mapTo(true));
  }

  private loadSelectedTeam(): Observable<void> {
    Logger.logDev('Selected Team Loaded Guard: load selected team');
    return this.userFacade.selectUser().pipe(
      filter((user) => !!user),
      take(1),
      map((user: User) => this.teamFacade.loadSelectedTeam(user.selectedTeamId))
    );
  }

  private waitForSelectedTeam(): Observable<void> {
    Logger.logDev('Selected Team Loaded Guard: waiting for team');
    return this.teamFacade.selectSelectedTeam().pipe(
      filter((team) => !!team),
      take(1),
      tap(() => Logger.logDev('Selected Team Loaded Guard: waiting for team, got one!')),
      flatMap(() => of(undefined))
    );
  }
}
