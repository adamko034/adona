import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { act } from '@ngrx/effects';

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
});