import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatStepperModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { NewTeamDialogComponent } from './components/dialogs/new-team-dialog/new-team-dialog.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [HomeComponent, NewTeamDialogComponent],
  imports: [CommonModule, SharedModule, MatStepperModule, MatDialogModule, HomeRoutingModule],
  entryComponents: [NewTeamDialogComponent]
})
export class HomeModule {}
