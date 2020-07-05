import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SettingsFacade } from 'src/app/modules/settings/store/settings.facade';

@Injectable({ providedIn: 'root' })
export class LoadSettingsTeamsResolver implements CanActivate {
  constructor(private settingsFacade: SettingsFacade) {}

  public canActivate(): boolean {
    this.settingsFacade.loadTeams();
    return true;
  }
}
