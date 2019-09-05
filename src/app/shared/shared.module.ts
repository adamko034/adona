import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatSnackBarModule } from '@angular/material';
import { DayHoursService } from 'src/app/shared/utils/time/day-hours.service';
import { TimeService } from 'src/app/shared/utils/time/time.service';
import { ErrorComponent, ErrorContentComponent } from './components/error/error.component';
import { HourQuartersService } from './utils/time/hour-quarters.service';

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  providers: [TimeService, DayHoursService, HourQuartersService],
  declarations: [ErrorComponent, ErrorContentComponent],
  exports: [ErrorComponent],
  entryComponents: [ErrorContentComponent]
})
export class SharedModule {}
