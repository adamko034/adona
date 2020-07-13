import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class LoadSettingsTeamGuard implements CanActivate {
  constructor(private teamsFacade: TeamsFacade) {}

  public canActivate(route: ActivatedRouteSnapshot) {
    Logger.logDev('load settings team guard, loading team: ' + route.params.id);
    if (!route.params.id) {
      return false;
    }

    this.teamsFacade.loadTeam(route.params.id);
    return true;
  }
}
