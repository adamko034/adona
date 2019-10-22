import { TimeComparisonService } from './time-comparison.service';

describe('TimeComparisonService', () => {
  let service: TimeComparisonService;

  beforeEach(() => {
    service = new TimeComparisonService();
  });

  describe('Is Date Before', () => {
    const inputs = [
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 12, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 12, 45),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 2, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 9, 2, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2020, 8, 2, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 1, 15, 0),
        secondDate: new Date(2019, 8, 2, 13, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 3, 15, 0),
        secondDate: new Date(2019, 9, 1, 13, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 3, 15, 0),
        secondDate: new Date(2020, 1, 1, 13, 0),
        expected: true
      }
    ];

    for (const input of inputs) {
      it(`should return ${
        input.expected
      } when comparing ${input.firstDate.toLocaleString()} to ${input.secondDate.toLocaleString()}`, () => {
        // when
        const result = service.isDateBefore(input.firstDate, input.secondDate);

        //
        expect(result).toBe(input.expected);
      });
    }
  });

  describe('Is Date Before Or Equal', () => {
    const inputs = [
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 12, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 12, 45),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 2, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 9, 2, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2020, 8, 2, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 1, 15, 0),
        secondDate: new Date(2019, 8, 2, 13, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 3, 15, 0),
        secondDate: new Date(2019, 9, 1, 13, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 3, 15, 0),
        secondDate: new Date(2020, 1, 1, 13, 0),
        expected: true
      }
    ];

    for (const input of inputs) {
      it(`should return ${
        input.expected
      } when comparing ${input.firstDate.toLocaleString()} to ${input.secondDate.toLocaleString()}`, () => {
        // when
        const result = service.isDateBeforeOrEqualThan(input.firstDate, input.secondDate);

        //
        expect(result).toBe(input.expected);
      });
    }
  });

  describe('Are Dates The Same', () => {
    const inputs = [
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 12, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 12, 45),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 1, 12, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: true
      },
      {
        firstDate: new Date(2019, 8, 2, 13, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 9, 1, 13, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2020, 8, 1, 13, 0),
        secondDate: new Date(2019, 8, 1, 13, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 1, 15, 0),
        secondDate: new Date(2019, 8, 2, 15, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 8, 1, 15, 0),
        secondDate: new Date(2019, 9, 1, 15, 0),
        expected: false
      },
      {
        firstDate: new Date(2019, 1, 1, 15, 0),
        secondDate: new Date(2020, 1, 1, 15, 0),
        expected: false
      }
    ];

    for (const input of inputs) {
      it(`should return ${
        input.expected
      } when comparing ${input.firstDate.toLocaleString()} to ${input.secondDate.toLocaleString()}`, () => {
        // when
        const result = service.areDatesTheSame(input.firstDate, input.secondDate);

        //
        expect(result).toBe(input.expected);
      });
    }
  });

  describe('Is Date Time Before', () => {
    [
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 7, 45), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 7, 15), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 8, 15), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 6, 15), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 19, 15), expected: true },
      { firstDate: new Date(2019, 10, 1, 19, 30), secondDate: new Date(2019, 10, 1, 6, 15), expected: false },
      { firstDate: new Date(2019, 10, 1, 20, 30), secondDate: new Date(2019, 10, 1, 21, 45), expected: true },
      { firstDate: new Date(2019, 10, 1, 21, 30), secondDate: new Date(2019, 10, 1, 20, 15), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 2, 6, 15), expected: true },
      { firstDate: new Date(2019, 10, 2, 7, 30), secondDate: new Date(2019, 10, 1, 6, 15), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 11, 1, 6, 15), expected: true },
      { firstDate: new Date(2019, 11, 1, 7, 30), secondDate: new Date(2019, 10, 1, 6, 15), expected: false },
      { firstDate: new Date(2019, 11, 1, 7, 30), secondDate: new Date(2018, 10, 1, 6, 15), expected: false },
      { firstDate: new Date(2018, 11, 1, 7, 30), secondDate: new Date(2019, 10, 1, 6, 15), expected: true }
    ].forEach(input => {
      it(`should return ${
        input.expected
      } when comparing ${input.firstDate.toLocaleString()} with ${input.secondDate.toLocaleString()}`, () => {
        // when
        const result = service.isDateTimeBefore(input.firstDate, input.secondDate);

        // then
        expect(result).toEqual(input.expected);
      });
    });
  });

  describe('Are In The Same Month', () => {
    [
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 7, 45), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 8, 30), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 2, 7, 30), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2020, 10, 1, 7, 30), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 11, 1, 7, 30), expected: false }
    ].forEach(input => {
      it(`should return ${input.expected} for dates: ${input.firstDate} and ${input.secondDate}`, () => {
        // when
        const result = service.areInTheSameMonth(input.firstDate, input.secondDate);

        // then
        expect(result).toEqual(input.expected);
      });
    });
  });

  describe('Are Date Hours The Same', () => {
    [
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 7, 45), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 7, 15), expected: true },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 7, 30), expected: true },
      { firstDate: new Date(2019, 10, 1, 15, 30), secondDate: new Date(2019, 10, 1, 15, 30), expected: true },
      { firstDate: new Date(2019, 10, 1, 15, 30), secondDate: new Date(2019, 10, 1, 15, 45), expected: true },
      { firstDate: new Date(2019, 10, 1, 15, 30), secondDate: new Date(2019, 10, 1, 15, 15), expected: true },
      { firstDate: new Date(2019, 10, 1, 3, 30), secondDate: new Date(2019, 10, 1, 15, 30), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 1, 8, 30), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 10, 2, 7, 30), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2019, 11, 1, 7, 30), expected: false },
      { firstDate: new Date(2019, 10, 1, 7, 30), secondDate: new Date(2018, 10, 1, 7, 30), expected: false }
    ].forEach(input => {
      it(`should return ${input.expected} for dates: ${input.firstDate} and ${input.secondDate}`, () => {
        // when
        const result = service.areDateHoursTheSame(input.firstDate, input.secondDate);

        // then
        expect(result).toEqual(input.expected);
      });
    });
  });

  describe('Is Date Between Dates', () => {
    [
      // days, true
      {
        date: new Date(2019, 10, 1, 7, 30),
        firstDate: new Date(2019, 10, 1, 7, 30),
        secondDate: new Date(2019, 10, 1, 7, 45),
        expected: true
      },
      {
        date: new Date(2019, 10, 1, 11, 30),
        firstDate: new Date(2019, 10, 1, 7, 30),
        secondDate: new Date(2019, 10, 1, 7, 45),
        expected: true
      },
      {
        date: new Date(2019, 10, 1, 11, 30),
        firstDate: new Date(2019, 10, 2, 15, 30),
        secondDate: new Date(2019, 10, 1, 20, 45),
        expected: true
      },
      {
        date: new Date(2019, 10, 1, 11, 30),
        firstDate: new Date(2019, 10, 1, 20, 30),
        secondDate: new Date(2019, 10, 2, 15, 45),
        expected: true
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 10, 1, 15, 30),
        secondDate: new Date(2019, 10, 10, 20, 45),
        expected: true
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 10, 10, 15, 30),
        secondDate: new Date(2019, 10, 2, 20, 45),
        expected: true
      }, // days, false
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 10, 1, 15, 30),
        secondDate: new Date(2019, 10, 2, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 10, 2, 15, 30),
        secondDate: new Date(2019, 10, 1, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 10, 5, 15, 30),
        secondDate: new Date(2019, 10, 15, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 10, 20, 15, 30),
        secondDate: new Date(2019, 10, 30, 20, 45),
        expected: false
      }, // months, true
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 8, 10, 15, 30),
        secondDate: new Date(2019, 11, 15, 20, 45),
        expected: true
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 11, 10, 15, 30),
        secondDate: new Date(2019, 8, 15, 20, 45),
        expected: true
      }, // months, false
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 1, 10, 15, 30),
        secondDate: new Date(2019, 8, 15, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 10, 3, 11, 30),
        firstDate: new Date(2019, 8, 10, 15, 30),
        secondDate: new Date(2019, 1, 15, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 5, 3, 11, 30),
        firstDate: new Date(2019, 1, 10, 15, 30),
        secondDate: new Date(2019, 3, 15, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 5, 3, 11, 30),
        firstDate: new Date(2019, 10, 10, 15, 30),
        secondDate: new Date(2019, 6, 15, 20, 45),
        expected: false
      }, // years, true
      {
        date: new Date(2019, 5, 3, 11, 30),
        firstDate: new Date(2017, 1, 10, 15, 30),
        secondDate: new Date(2020, 3, 15, 20, 45),
        expected: true
      },
      {
        date: new Date(2019, 5, 3, 11, 30),
        firstDate: new Date(2020, 1, 10, 15, 30),
        secondDate: new Date(2018, 3, 15, 20, 45),
        expected: true
      }, // years, false
      {
        date: new Date(2019, 5, 3, 11, 30),
        firstDate: new Date(2017, 1, 10, 15, 30),
        secondDate: new Date(2015, 3, 15, 20, 45),
        expected: false
      },
      {
        date: new Date(2019, 5, 3, 11, 30),
        firstDate: new Date(2020, 1, 10, 15, 30),
        secondDate: new Date(2021, 3, 15, 20, 45),
        expected: false
      }
    ].forEach(input => {
      it(`should return ${input.expected} when comparing ${input.date} to ${input.firstDate} and ${input.secondDate}`, () => {
        // when
        const result = service.isDateBetweenDates(input.date, input.firstDate, input.secondDate);

        // then
        expect(result).toEqual(input.expected);
      });
    });
  });
});
