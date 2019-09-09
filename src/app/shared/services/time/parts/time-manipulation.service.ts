import * as moment from 'moment';

export class TimeManipulationService {
  public addDays(amount: number, date: Date): Date {
    return moment(date)
      .add(amount, 'day')
      .toDate();
  }

  public addMinutes(amount: number, date: Date): Date {
    return moment(date)
      .add(amount, 'minutes')
      .toDate();
  }
}
