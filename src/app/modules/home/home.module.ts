import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatStepperModule
} from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { NewTeamDialogComponent } from './components/dialogs/new-team-dialog/new-team-dialog.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [HomeComponent, NewTeamDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatStepperModule,
    MatDialogModule,
    MatButtonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatCheckboxModule
  ],
  entryComponents: [NewTeamDialogComponent]
})
export class HomeModule {}
