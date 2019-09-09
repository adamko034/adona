import * as moment from 'moment';

export class TimeComparisonService {
  public isDateBefore(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isBefore(moment(secondDate).startOf('day'));
  }

  public isDateBeforeOrEqualThan(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isSameOrBefore(moment(secondDate).startOf('day'));
  }

  public areDatesTheSame(date: Date, secondDate: Date): boolean {
    return moment(date)
      .startOf('day')
      .isSame(moment(secondDate).startOf('day'));
  }
}
