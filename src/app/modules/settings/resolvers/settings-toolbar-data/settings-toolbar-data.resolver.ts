import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { SettingsToolbarFactory } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar-factory.service';
import { SettingsToolbar } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.model';

@Injectable({ providedIn: 'root' })
export class SettingToollbarDataResolver implements Resolve<SettingsToolbar> {
  constructor(private settingsToolbarDataFactory: SettingsToolbarFactory, private userFacade: UserFacade) {}

  public resolve(route: ActivatedRouteSnapshot): SettingsToolbar | Observable<SettingsToolbar> {
    const type = route.data.type;

    if (type === SettingsPages.MyAccount) {
      return this.userFacade.selectUser().pipe(
        filter((user: User) => !!user),
        take(1),
        map((user: User) => {
          return this.settingsToolbarDataFactory.createWithSubtitle(type, user.email);
        })
      );
    }

    return this.settingsToolbarDataFactory.create(type);
  }
}
