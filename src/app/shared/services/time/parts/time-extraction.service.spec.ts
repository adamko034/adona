import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { DateTestBuilder } from '../../../../utils/testUtils/builders/date-test.builder';
import { DateFormat } from '../model/date-format.enum';

describe('Time Extraction Service', () => {
  let service: TimeExtractionService;

  beforeEach(() => {
    service = new TimeExtractionService();
  });

  describe('Get Year Month String', () => {
    [
      {
        date: new Date(2019, 8, 3),
        expected: '201909'
      },
      { date: new Date(2018, 9, 4), expected: '201810' }
    ].forEach(input => {
      it(`should return ${input.expected} for date: ${input.date}`, () => {
        // when
        const actual = service.getYearMonthString(input.date);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });

  describe('Get Start Of Day', () => {
    it('should return 2019-01-01 00:00:00 for 2019-01-01', () => {
      // given
      const date = new Date(2019, 0, 1, 15, 45, 30);

      // when
      const actual = service.getStartOfDay(date);

      // then
      expect(actual.getFullYear()).toEqual(date.getFullYear());
      expect(actual.getMonth()).toEqual(date.getMonth());
      expect(actual.getDate()).toEqual(date.getDate());
      expect(actual.getHours()).toEqual(0);
      expect(actual.getMinutes()).toEqual(0);
      expect(actual.getSeconds()).toEqual(0);
    });
  });

  describe('Get End Of Day', () => {
    it('should return 2019-01-01 23:59:59 for 2019-01-01', () => {
      // given
      const date = new Date(2019, 0, 1, 15, 45, 30);

      // when
      const actual = service.getEndOfDay(date);

      // then
      expect(actual.getFullYear()).toEqual(date.getFullYear());
      expect(actual.getMonth()).toEqual(date.getMonth());
      expect(actual.getDate()).toEqual(date.getDate());
      expect(actual.getHours()).toEqual(23);
      expect(actual.getMinutes()).toEqual(59);
      expect(actual.getSeconds()).toEqual(59);
    });
  });

  describe('Get Start Of Month', () => {
    it('should return 2019-07-01 00:00:00 for 2019-07-15', () => {
      // given
      const date = new Date(2019, 6, 15, 15, 45, 30);

      // when
      const actual = service.getStartOfMonth(date);

      // then
      expect(actual.getFullYear()).toEqual(date.getFullYear());
      expect(actual.getMonth()).toEqual(date.getMonth());
      expect(actual.getDate()).toEqual(1);
      expect(actual.getHours()).toEqual(0);
      expect(actual.getMinutes()).toEqual(0);
      expect(actual.getSeconds()).toEqual(0);
    });
  });

  describe('Get End Of Month', () => {
    it('should return 2019-07-31 23:59:59 for 2019-07-15', () => {
      // given
      const date = new Date(2019, 6, 15, 15, 45, 30);

      // when
      const actual = service.getEndOfMonth(date);

      // then
      expect(actual.getFullYear()).toEqual(date.getFullYear());
      expect(actual.getMonth()).toEqual(date.getMonth());
      expect(actual.getDate()).toEqual(31);
      expect(actual.getHours()).toEqual(23);
      expect(actual.getMinutes()).toEqual(59);
      expect(actual.getSeconds()).toEqual(59);
    });
  });

  describe('Get Time String', () => {
    [
      { date: new Date(2019, 1, 1, 7, 7), expected: '07:07' },
      { date: new Date(2019, 1, 1, 22, 45), expected: '22:45' }
    ].forEach(input => {
      it(`should return ${input.expected} for date ${input.date}`, () => {
        // when
        const actual = service.getTimeString(input.date);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });

  describe('Get Date Time String', () => {
    [
      { date: new Date(2019, 8, 1, 7, 7), expected: '01-09-2019 07:07' },
      { date: new Date(2019, 10, 11, 17, 17), expected: '11-11-2019 17:17' }
    ].forEach(({ date, expected }) => {
      it(`should return ${expected} for date ${date}`, () => {
        // when
        const actual = service.getDateTimeString(date);

        // then
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Get Date String', () => {
    [
      { date: new Date(2019, 8, 1, 7, 7), expected: '01-09-2019' },
      { date: new Date(2019, 10, 11, 17, 17), expected: '11-11-2019' }
    ].forEach(({ date, expected }) => {
      it(`should return ${expected} for date ${date}`, () => {
        // when
        const actual = service.getDateString(date);

        // then
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Get Previous Month Of', () => {
    [
      { date: new Date(2019, 10, 11, 20, 15), expected: new Date(2019, 9, 11, 20, 15) },
      { date: new Date(2019, 0, 11, 20, 15), expected: new Date(2018, 11, 11, 20, 15) },
      { date: new Date(2019, 2, 31, 20, 15), expected: new Date(2019, 1, 28, 20, 15) }
    ].forEach(({ date, expected }) => {
      it(`should return ${expected} for ${date}`, () => {
        // when
        const actual = service.getPreviousMonthOf(date);

        // then
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Get Hour String', () => {
    [
      { date: new Date(2019, 1, 1, 7, 7), expected: '07' },
      { date: new Date(2019, 1, 1, 22, 45), expected: '22' }
    ].forEach(input => {
      it(`should return ${input.expected} for date ${input.date}`, () => {
        // when
        const actual = service.getHourString(input.date);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });

  describe('Get Date Formatted', () => {
    [
      {
        date: new Date(2019, 11, 22, 11, 38),
        format: DateFormat.LongDayNameDayNumberLongMonthName,
        expected: 'Sunday 22 December'
      },
      {
        date: new Date(2019, 11, 6, 11, 38),
        format: DateFormat.LongDayNameDayNumberLongMonthName,
        expected: 'Friday 06 December'
      },
      { date: new Date(2019, 11, 22, 11, 38), format: DateFormat.LongMonthName, expected: 'December' },
      {
        date: new Date(2019, 11, 22, 11, 38),
        format: DateFormat.MidDayNameDayNumberMidMonthName,
        expected: 'Sun 22 Dec'
      },
      {
        date: new Date(2019, 11, 6, 11, 38),
        format: DateFormat.MidDayNameDayNumberMidMonthName,
        expected: 'Fri 06 Dec'
      }
    ].forEach(input => {
      it(`should return ${input.expected} for ${input.date} and format: ${input.format}`, () => {
        // when
        const actual = service.getDateFormatted(input.date, input.format);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });

  describe('Get End Of Week', () => {
    [
      { date: new Date(2019, 11, 22, 11, 18), expected: new Date(2019, 11, 22, 23, 59, 59) },
      { date: new Date(2019, 11, 16, 11, 18), expected: new Date(2019, 11, 22, 23, 59, 59) },
      { date: new Date(2019, 11, 19, 11, 18), expected: new Date(2019, 11, 22, 23, 59, 59) }
    ].forEach(input => {
      it(`should return ${input.expected} as a end of week for ${input.date}`, () => {
        // when
        const actual = service.getEndOfWeek(input.date);

        // then
        expect(actual.getFullYear()).toEqual(input.expected.getFullYear());
        expect(actual.getMonth()).toEqual(input.expected.getMonth());
        expect(actual.getDate()).toEqual(input.expected.getDate());
        expect(actual.getMinutes()).toEqual(input.expected.getMinutes());
        expect(actual.getHours()).toEqual(input.expected.getHours());
      });
    });
  });

  describe('Get Start Of Week', () => {
    [
      { date: new Date(2019, 11, 22, 11, 18), expected: new Date(2019, 11, 16, 0, 0) },
      { date: new Date(2019, 11, 16, 11, 18), expected: new Date(2019, 11, 16, 0, 0) },
      { date: new Date(2019, 11, 19, 11, 18), expected: new Date(2019, 11, 16, 0, 0) }
    ].forEach(input => {
      it(`should return ${input.expected} as a start of week for ${input.date}`, () => {
        // when
        const actual = service.getStartOfWeek(input.date);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });

  describe('Get Next Month Of', () => {
    [
      { date: new Date(2019, 10, 11, 20, 15), expected: new Date(2019, 11, 11, 20, 15) },
      { date: new Date(2019, 11, 11, 20, 15), expected: new Date(2020, 0, 11, 20, 15) },
      { date: new Date(2019, 2, 31, 20, 15), expected: new Date(2019, 3, 30, 20, 15) }
    ].forEach(({ date, expected }) => {
      it(`should return ${expected} for ${date}`, () => {
        // when
        const actual = service.getNextMonthOf(date);

        // then
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Get Days Between', () => {
    [
      { date1: new Date(2020, 1, 1), date2: new Date(2020, 1, 2), expected: 1 },
      { date1: new Date(2020, 1, 1, 14), date2: new Date(2020, 1, 2, 22), expected: 1 },
      { date1: new Date(2020, 1, 1, 14), date2: new Date(2020, 1, 1, 22), expected: 0 },
      { date1: new Date(2020, 1, 8), date2: new Date(2020, 1, 6), expected: 2 },
      { date1: new Date(2020, 1, 8, 22), date2: new Date(2020, 1, 6, 23), expected: 2 }
    ].forEach(input => {
      it(`should return ${input.expected} for dates: ${input.date1} and ${input.date2}`, () => {
        // when & then
        expect(service.getDaysBetween(input.date1, input.date2)).toEqual(input.expected);
      });
    });
  });

  describe('Is Date Between', () => {
    [
      {
        date: new Date(2020, 1, 1),
        date1: new Date(2020, 1, 1),
        date2: new Date(2020, 1, 2),
        including: true,
        expected: true
      },
      {
        date: new Date(2020, 0, 1),
        date1: new Date(2019, 11, 1),
        date2: new Date(2020, 1, 1),
        including: true,
        expected: true
      },
      {
        date: new Date(2020, 1, 1),
        date1: new Date(2020, 1, 1),
        date2: new Date(2020, 1, 2),
        including: false,
        expected: false
      },
      {
        date: new Date(2020, 1, 2),
        date1: new Date(2020, 1, 1),
        date2: new Date(2020, 1, 3),
        including: false,
        expected: true
      },
      {
        date: new Date(2020, 1, 10),
        date1: new Date(2020, 1, 11),
        date2: new Date(2020, 1, 9),
        including: false,
        expected: true
      }
    ].forEach(input => {
      it(`should return ${input.expected} for ${input.date} between ${input.date1}
        and ${input.date2} including: ${input.including}`, () => {
        // when & then
        expect(service.isDateBetweenDates(input.date, input.date1, input.date2, input.including)).toEqual(
          input.expected
        );
      });
    });
  });

  describe('Get Days Ago String', () => {
    [
      { date: DateTestBuilder.today().build(), result: 'today' },
      {
        date: DateTestBuilder.today()
          .addDays(-1)
          .build(),
        result: 'yesterday'
      },
      {
        date: DateTestBuilder.today()
          .addDays(-5)
          .build(),
        result: '5 days ago'
      },
      {
        date: DateTestBuilder.today()
          .addDays(-12)
          .build(),
        result: '12 days ago'
      }
    ].forEach(input => {
      it(`should return ${input.result} for date ${input.date}`, () => {
        // when
        const result = service.getDaysAgoString(input.date);

        // then
        expect(result).toEqual(input.result);
      });
    });
  });
});
