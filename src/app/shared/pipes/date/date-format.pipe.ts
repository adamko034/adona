import { PipeTransform, Pipe } from '@angular/core';
import { DateFormat } from '../../services/time/model/date-format.enum';
import { TimeService } from '../../services/time/time.service';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  constructor(private timeService: TimeService) {}

  transform(value: Date, format: DateFormat) {
    return this.timeService.Extraction.getDateFormatted(value, format);
  }
}
