import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SettingsListComponent } from 'src/app/modules/settings/pages/settings-list/settings-list.component';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsAccountComponent } from './components/settings-account/settings-account.component';
import { SettingsSecurityComponent } from './components/settings-security/settings-security.component';
import { SettingsTeamsComponent } from './components/settings-teams/settings-teams.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    SettingsListComponent,
    SettingsAccountComponent,
    SettingsSecurityComponent,
    SettingsTeamsComponent,
    SettingsComponent
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
    ReactiveFormsModule
  ]
})
export class SettingsModule {}
