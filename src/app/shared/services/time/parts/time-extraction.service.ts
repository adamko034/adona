import * as moment from 'moment';
import { DateFormat } from '../model/date-format.enum';

export class TimeExtractionService {
  public getYearMonthString(date: Date) {
    const leadingZero = date.getMonth() < 9 ? '0' : '';
    return `${date.getFullYear()}${leadingZero}${date.getMonth() + 1}`;
  }

  public getStartOfDay(date: Date): Date {
    return moment(date)
      .startOf('day')
      .toDate();
  }

  public getEndOfDay(date: Date): Date {
    return moment(date)
      .endOf('day')
      .toDate();
  }

  public getStartOfMonth(date: Date): Date {
    return moment(date)
      .startOf('month')
      .toDate();
  }

  public getEndOfMonth(date: Date): Date {
    return moment(date)
      .endOf('month')
      .toDate();
  }

  public getTimeString(date: Date): string {
    return moment(date).format('HH:mm');
  }

  public getDateTimeString(date: Date): string {
    return moment(date).format('DD-MM-YYYY HH:mm');
  }

  public getDateString(date: Date): string {
    return moment.utc(date).format('DD-MM-YYYY');
  }

  public getPreviousMonthOf(date: Date): Date {
    return moment(date)
      .add(-1, 'month')
      .toDate();
  }

  public getHourString(date: Date): string {
    return moment(date).format('HH');
  }

  public getDateFormatted(date: Date, format: DateFormat): string {
    return moment(date).format(format.toString());
  }

  public getEndOfWeek(date: Date): Date {
    return moment(date)
      .endOf('isoWeek')
      .toDate();
  }

  public getStartOfWeek(date: Date): Date {
    return moment(date)
      .startOf('isoWeek')
      .toDate();
  }

  public getNextMonthOf(date: Date): Date {
    return moment(date)
      .add(1, 'month')
      .toDate();
  }

  public getDaysBetween(date1: Date, date2: Date): number {
    return Math.abs(
      moment(date1)
        .startOf('day')
        .diff(moment(date2).startOf('day'), 'days')
    );
  }

  public isDateBetweenDates(date: Date, start: Date, end: Date, including = true): boolean {
    const minDaysBetween = including ? 0 : 1;

    return this.getDaysBetween(start, date) >= minDaysBetween && this.getDaysBetween(date, end) >= minDaysBetween;
  }
}
