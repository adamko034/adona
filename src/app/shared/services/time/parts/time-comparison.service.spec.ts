import { TimeComparisonService } from './time-comparison.service';

describe('TimeComparisonService', () => {
  let service: TimeComparisonService;

  beforeEach(() => {
    service = new TimeComparisonService();
  });

  describe('isDateBefore', () => {
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

  describe('isDateBeforeOrEqual', () => {
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

  describe('areDatesTheSame', () => {
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
});
