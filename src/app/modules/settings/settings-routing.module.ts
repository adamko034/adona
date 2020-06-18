import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsAccountComponent } from 'src/app/modules/settings/components/settings-account/settings-account.component';
import { SettingsSecurityComponent } from 'src/app/modules/settings/components/settings-security/settings-security.component';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/settings-teams/settings-teams.component';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'account',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'account',
        component: SettingsAccountComponent
      },
      {
        path: 'security',
        component: SettingsSecurityComponent
      },
      {
        path: 'teams',
        component: SettingsTeamsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
