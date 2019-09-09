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
  providers: [TimeService],
  declarations: [ErrorComponent, ErrorContentComponent, FromToDatesComponent],
  exports: [ErrorComponent, FromToDatesComponent],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
