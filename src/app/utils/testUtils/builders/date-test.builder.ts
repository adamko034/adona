import * as moment from 'moment';

export class DateTestBuilder {
  private date: moment.Moment;

  private constructor() {
    this.date = moment();
  }

  public static today(): DateTestBuilder {
    return new DateTestBuilder();
  }

  public addDays(amount: number): DateTestBuilder {
    this.date.add(amount, 'days');
    return this;
  }

  public build(): Date {
    return this.date.toDate();
  }
}
