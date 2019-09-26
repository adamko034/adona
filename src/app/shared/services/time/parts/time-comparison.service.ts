import * as moment from 'moment';

export class TimeComparisonService {
  public isDateBefore(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isBefore(moment(secondDate).startOf('day'));
  }

  public isDateTimeBefore(date: Date, secondDate: Date): boolean {
    return moment(date).isBefore(moment(secondDate));
  }

  public isDateBeforeOrEqualThan(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isSameOrBefore(moment(secondDate).startOf('day'));
  }

  public areInTheSameMonth(date: Date, secondDate: Date) {
    return moment(date).isSame(moment(secondDate), 'month');
  }

  public areDatesTheSame(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isSame(moment(secondDate).startOf('day'));
  }

  public areDateHoursTheSame(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('hour')
      .isSame(moment(secondDate).startOf('hour'));
  }
}
