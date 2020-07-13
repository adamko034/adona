import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsAccountComponent } from 'src/app/modules/settings/components/settings-account/settings-account.component';
import { SettingsTeamComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team.component';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/teams/settings-teams/settings-teams.component';
import { SettingsPages } from 'src/app/modules/settings/enums/settings-types.enum';
import { LoadSettingsTeamGuard } from 'src/app/modules/settings/guards/teams/load-settings-team.guard';
import { LoadSettingsTeamsGuard } from 'src/app/modules/settings/guards/teams/load-settings-teams.guard';
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
        canActivate: [LoadSettingsTeamsGuard],
        resolve: { toolbar: SettingToollbarDataResolver },
        data: { type: SettingsPages.Teams }
      },
      {
        path: 'teams/:id',
        component: SettingsTeamComponent,
        canActivate: [LoadSettingsTeamGuard],
        resolve: { toolbar: SettingToollbarDataResolver },
        data: { type: SettingsPages.TeamDetails }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
