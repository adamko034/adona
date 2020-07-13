import { Injectable } from '@angular/core';
import { routesN } from 'src/app/core/router/constants/routes.constants';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { SettingsToolbarBuilder } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.builder';
import { SettingsToolbar } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.model';
import { resources } from 'src/app/shared/resources/resources';

@Injectable({ providedIn: 'root' })
export class SettingsToolbarFactory {
  public create(settingPageType: SettingsPages): SettingsToolbar {
    return this.initBuilder(settingPageType).build();
  }

  public createWithSubtitle(settingType: SettingsPages, subtitle: string): SettingsToolbar {
    return this.initBuilder(settingType).withSubtitle(subtitle).build();
  }

  private initBuilder(settingType: SettingsPages): SettingsToolbarBuilder {
    switch (settingType) {
      case SettingsPages.MyAccount:
        return SettingsToolbarBuilder.from(routesN.settings.myAccount.name, routesN.settings.list.url);
      case SettingsPages.Teams:
        return SettingsToolbarBuilder.from(routesN.settings.teams.name, routesN.settings.list.url);
      case SettingsPages.TeamDetails:
        return SettingsToolbarBuilder.from(resources.settings.teamDetails.title, routesN.settings.teams.url);
    }
  }
}
