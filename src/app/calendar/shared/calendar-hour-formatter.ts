import {
  CalendarNativeDateFormatter,
  DateFormatterParams
} from 'angular-calendar';

export class CalendarHourFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date }: DateFormatterParams): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: false
    }).format(date);
  }

  public weekViewHour({ date }: DateFormatterParams): string {
    return this.dayViewHour({ date });
  }
}
