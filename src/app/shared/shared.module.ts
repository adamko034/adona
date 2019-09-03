import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatSnackBarModule } from '@angular/material';
import { ErrorComponent, ErrorContentComponent } from './components/error/error.component';
import { TimeService } from 'src/app/shared/utils/time/time.service';
import { DayHoursService } from 'src/app/shared/utils/time/day-hours.service';

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  providers: [TimeService, DayHoursService],
  declarations: [ErrorComponent, ErrorContentComponent],
  exports: [ErrorComponent],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
