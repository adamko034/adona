import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { SettingsAccountComponent } from 'src/app/modules/settings/components/settings-account/settings-account.component';
import { SettingsSecurityComponent } from 'src/app/modules/settings/components/settings-security/settings-security.component';
import { SettingsTeamComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team.component';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/teams/settings-teams/settings-teams.component';
import { SettingsListComponent } from 'src/app/modules/settings/pages/settings-list/settings-list.component';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';
import { SettingsRoutingModule } from 'src/app/modules/settings/settings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsTeamMembersComponent } from './components/teams/settings-team/settings-team-members/settings-team-members.component';
import { SettingsTeamNameComponent } from './components/teams/settings-team/settings-team-name/settings-team-name.component';

@NgModule({
  declarations: [
    SettingsListComponent,
    SettingsAccountComponent,
    SettingsSecurityComponent,
    SettingsTeamsComponent,
    SettingsComponent,
    SettingsTeamComponent,
    SettingsTeamMembersComponent,
    SettingsTeamNameComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    SharedModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule {}
