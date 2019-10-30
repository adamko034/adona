import { TimeService } from 'src/app/shared/services/time/time.service';
import { CalendarHourFormatter } from './calendar-hour-formatter';

function toHourString(date: Date): string {
  const hour = date.getHours() <= 9 ? '0' : '';
  return hour + `${date.getHours()}`;
}

describe('Calendar Hour Formatter', () => {
  const inputs = [
    new Date(2019, 10, 1, 7, 0),
    new Date(2019, 10, 1, 7, 30),
    new Date(2019, 10, 1, 15, 0),
    new Date(2019, 10, 1, 15, 45)
  ];
  let formatter: CalendarHourFormatter;

  beforeEach(() => {
    formatter = new CalendarHourFormatter(new TimeService());
  });

  describe('Day View Hour', () => {
    inputs.forEach(date => {
      it(`should return ${toHourString(date)}`, () => {
        // when
        const result = formatter.dayViewHour({ date });

        // then
        expect(result).toEqual(toHourString(date));
      });
    });
  });

  describe('Week View Hour', () => {
    inputs.forEach(date => {
      it(`should return ${toHourString(date)}`, () => {
        // when
        const result = formatter.weekViewHour({ date });

        // then
        expect(result).toEqual(toHourString(date));
      });
    });
  });
});
