import { CalendarNativeDateFormatter, DateFormatterParams } from 'angular-calendar';
import { TimeService } from 'src/app/shared/services/time/time.service';

export class CalendarHourFormatter extends CalendarNativeDateFormatter {
  public constructor(private timeService: TimeService) {
    super({} as any);
  }

  public dayViewHour({ date }: DateFormatterParams): string {
    return this.timeService.Extraction.getHourString(date);
  }

  public weekViewHour({ date }: DateFormatterParams): string {
    return this.dayViewHour({ date });
  }
}
