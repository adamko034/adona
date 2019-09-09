import { TimeManipulationService } from 'src/app/shared/services/time/parts/time-manipulation.service';

describe('TimeManipulationService', () => {
  let service: TimeManipulationService;

  beforeAll(() => {
    service = new TimeManipulationService();
  });

  describe('AddDays', () => {
    const inputs = [
      {
        date: new Date(2019, 9, 1, 10, 15),
        amount: 1,
        expected: new Date(2019, 9, 2, 10, 15)
      },
      {
        date: new Date(2019, 9, 2, 10, 15),
        amount: -1,
        expected: new Date(2019, 9, 1, 10, 15)
      },
      {
        date: new Date(2019, 9, 30, 10, 15),
        amount: 5,
        expected: new Date(2019, 10, 4, 10, 15)
      },
      {
        date: new Date(2019, 12, 30, 10, 15),
        amount: 2,
        expected: new Date(2020, 1, 1, 10, 15)
      }
    ];

    for (const input of inputs) {
      it(`should return ${input.expected.toLocaleString()} when adding ${
        input.amount
      } day(s) to ${input.date.toLocaleString()}`, () => {
        // when
        const result = service.addDays(input.amount, input.date);

        // then
        expect(result.getFullYear()).toBe(input.expected.getFullYear());
        expect(result.getMonth()).toBe(input.expected.getMonth());
        expect(result.getDate()).toBe(input.expected.getDate());
        expect(result.getHours()).toBe(input.expected.getHours());
        expect(result.getMinutes()).toBe(input.expected.getMinutes());
      });
    }
  });

  describe('AddMinutes', () => {
    const inputs = [
      {
        date: new Date(2019, 9, 1, 10, 15),
        amount: 10,
        expected: new Date(2019, 9, 1, 10, 25)
      },
      {
        date: new Date(2019, 9, 1, 10, 15),
        amount: -10,
        expected: new Date(2019, 9, 1, 10, 5)
      },
      {
        date: new Date(2019, 9, 1, 23, 45),
        amount: 15,
        expected: new Date(2019, 9, 2, 0, 0)
      },
      {
        date: new Date(2019, 8, 30, 23, 45),
        amount: 15,
        expected: new Date(2019, 9, 1, 0, 0)
      }
    ];
    for (const input of inputs) {
      it(`should return ${input.expected.toLocaleString()} when adding ${
        input.amount
      } minutes to ${input.expected.toLocaleString()}`, () => {
        // when
        const result = service.addMinutes(input.amount, input.date);

        // then
        expect(result.getFullYear()).toBe(input.expected.getFullYear());
        expect(result.getMonth()).toBe(input.expected.getMonth());
        expect(result.getDate()).toBe(input.expected.getDate());
        expect(result.getHours()).toBe(input.expected.getHours());
        expect(result.getMinutes()).toBe(input.expected.getMinutes());
      });
    }
  });
});
