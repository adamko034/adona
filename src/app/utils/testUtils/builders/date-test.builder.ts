import * as moment from 'moment';

export class DateTestBuilder {
  private date: moment.Moment;

  private constructor() {
    this.date = moment();
  }

  public static now(): DateTestBuilder {
    return new DateTestBuilder();
  }

  public addDays(amount: number): DateTestBuilder {
    this.date.add(amount, 'days');
    return this;
  }

  public addSeconds(amount: number): DateTestBuilder {
    this.date.add(amount, 'seconds');
    return this;
  }

  public build(): Date {
    return this.date.toDate();
  }
}
