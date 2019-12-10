import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ErrorComponent, ErrorContentComponent } from './components/error/error.component';
import { FromToDatesComponent } from './components/from-to-dates/from-to-dates.component';
import { FormsModule } from '@angular/forms';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { DateFormatPipe } from './pipes/date/date-format.pipe';

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
    MatSelectModule
  ],
  providers: [TimeService, EnvironmentService, DateFormatPipe],
  declarations: [ErrorComponent, ErrorContentComponent, FromToDatesComponent, DateFormatPipe],
  exports: [ErrorComponent, FromToDatesComponent, DateFormatPipe],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
