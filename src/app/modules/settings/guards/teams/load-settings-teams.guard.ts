import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TeamsFacade } from 'src/app/core/team/teams.facade';

@Injectable({ providedIn: 'root' })
export class LoadSettingsTeamsGuard implements CanActivate {
  constructor(private teamsFacade: TeamsFacade) {}

  public canActivate(): boolean {
    this.teamsFacade.loadTeams();
    return true;
  }
}
