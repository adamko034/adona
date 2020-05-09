import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../../shared/shared.module';
import { NewTeamDialogComponent } from './components/dialogs/new-team-dialog/new-team-dialog.component';
import { HomeToolbarComponent } from './components/home-toolbar/home-toolbar.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [HomeComponent, NewTeamDialogComponent, HomeToolbarComponent],
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
    MatCheckboxModule,
    MatToolbarModule,
    MatSelectModule,
    MatListModule,
    MatRadioModule,
    A11yModule
  ],
  entryComponents: [NewTeamDialogComponent]
})
export class HomeModule {}
