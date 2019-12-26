import { KeyValue } from '@angular/common';
import { DayHoursService } from 'src/app/shared/services/time/parts/day-hours.service';

const hourToString = (hour: number): string => {
  return hour <= 9 ? `0${hour.toString()}` : hour.toString();
};

const createHoursArray = (startHour: number, includeEquals: boolean, greaterMode: boolean): number[] => {
  let predicate;
  if (greaterMode) {
    predicate = includeEquals ? x => x >= startHour : x => x > startHour;
  } else {
    predicate = includeEquals ? x => x <= startHour : x => x < startHour;
  }
  return Array.from(Array(24).keys()).filter(predicate);
};

const createDayHoursInput = (includeEquals: boolean, greaterMode: boolean): any[] => {
  let i = 0;
  const inputs = [];
  for (; i <= 23; i++) {
    const input = {
      hour: i,
      expected: createHoursArray(i, includeEquals, greaterMode)
    };

    inputs.push(input);
  }

  return inputs;
};

const assertDayHoursResult = (result: KeyValue<number, string>[], expected: number[], greaterMode: boolean) => {
  expect(result).toBeTruthy();
  expect(result.length).toBe(expected.length);

  const startingHour = greaterMode ? expected[0] : expected[expected.length - 1];

  if (greaterMode) {
    for (let i = startingHour; i <= 23; i++) {
      const actual = result.find(x => x.key === i);

      expect(actual).toBeTruthy();
      expect(actual.value).toBe(hourToString(i));
    }
  } else {
    for (let i = startingHour; i >= 0; i--) {
      const actual = result.find(x => x.key === i);

      expect(actual).toBeTruthy();
      expect(actual.value).toBe(hourToString(i));
    }
  }
};

describe('Day Hours Service', () => {
  let service: DayHoursService;

  beforeEach(() => {
    service = new DayHoursService();
  });

  describe('Get All', () => {
    it('should return all day hours', () => {
      // given
      const expected = Array.from(Array(24).keys());

      // when
      const result = service.getAll();

      // then
      assertDayHoursResult(result, expected, true);
    });
  });

  describe('Get Greater Or Equal Than', () => {
    const inputs = createDayHoursInput(true, true);

    inputs.forEach(input => {
      it(`should return ${input.expected.length} hours for starting hour: ${input.hour}`, () => {
        // when
        const result = service.getGreaterOrEqualThen(input.hour);

        // then
        assertDayHoursResult(result, input.expected, true);
      });
    });
  });

  describe('Get Greater Than', () => {
    const inputs = createDayHoursInput(false, true);

    inputs.forEach(input => {
      it(`should return ${input.expected.length} hours for starting hour: ${input.hour}`, () => {
        // when
        const result = service.getGreaterThen(input.hour);

        // then
        assertDayHoursResult(result, input.expected, true);
      });
    });
  });

  describe('Get Lower Than', () => {
    const inputs = createDayHoursInput(false, false);

    inputs.forEach(input => {
      it(`should return ${input.expected.length} hours for starting hour: ${input.hour}`, () => {
        // when
        const result = service.getLowerThan(input.hour);

        // then
        assertDayHoursResult(result, input.expected, false);
      });
    });
  });

  describe('Get Lower Or Equal Than', () => {
    const inputs = createDayHoursInput(true, false);

    inputs.forEach(input => {
      it(`should return ${input.expected.length} hours for starting hour: ${input.hour}`, () => {
        // when
        const result = service.getLowerOrEqualThan(input.hour);

        // then
        assertDayHoursResult(result, input.expected, false);
      });
    });
  });
});
