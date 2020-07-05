import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SettingsAccountComponent } from 'src/app/modules/settings/components/settings-account/settings-account.component';
import { SettingsSecurityComponent } from 'src/app/modules/settings/components/settings-security/settings-security.component';
import { SettingsTeamComponent } from 'src/app/modules/settings/components/teams/settings-team/settings-team.component';
import { SettingsTeamsComponent } from 'src/app/modules/settings/components/teams/settings-teams/settings-teams.component';
import { SettingsListComponent } from 'src/app/modules/settings/pages/settings-list/settings-list.component';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';
import { SettingsRoutingModule } from 'src/app/modules/settings/settings-routing.module';
import { SettingsTeamsEffects } from 'src/app/modules/settings/store/effects/teams/settings-teams.effects';
import { settingsReducers } from 'src/app/modules/settings/store/reducers';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SettingsListComponent,
    SettingsAccountComponent,
    SettingsSecurityComponent,
    SettingsTeamsComponent,
    SettingsComponent,
    SettingsTeamComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    SharedModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([SettingsTeamsEffects]),
    StoreModule.forFeature('settings', settingsReducers)
  ]
})
export class SettingsModule {}
