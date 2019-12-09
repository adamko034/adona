import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ErrorComponent, ErrorContentComponent } from './components/error/error.component';
import { FromToDatesComponent } from './components/from-to-dates/from-to-dates.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    FlexLayoutModule
  ],
  providers: [TimeService, EnvironmentService],
  declarations: [ErrorComponent, ErrorContentComponent, FromToDatesComponent],
  exports: [ErrorComponent, FromToDatesComponent],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
