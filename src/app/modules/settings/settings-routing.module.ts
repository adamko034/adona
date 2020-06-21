import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsAccountComponent } from 'src/app/modules/settings/components/settings-account/settings-account.component';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/settings-teams/settings-teams.component';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { SettingsListComponent } from 'src/app/modules/settings/pages/settings-list/settings-list.component';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';
import { SettingToollbarDataResolver } from 'src/app/modules/settings/resolvers/settings-toolbar-data/settings-toolbar-data.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: SettingsListComponent
  },
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'account',
        component: SettingsAccountComponent,
        resolve: { toolbar: SettingToollbarDataResolver },
        data: { type: SettingsPages.MyAccount }
      },
      {
        path: 'teams',
        component: SettingsTeamsComponent,
        resolve: { toolbar: SettingToollbarDataResolver },
        data: { type: SettingsPages.Teams }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
