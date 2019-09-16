import * as moment from 'moment';

export class TimeExtractionService {
  public getYearMonthString(date: Date) {
    return `${date.getFullYear()}${date.getMonth()}`;
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
}
