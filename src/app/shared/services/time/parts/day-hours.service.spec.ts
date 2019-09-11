import { DayHoursService } from 'src/app/shared/services/time/parts/day-hours.service';
import { start } from 'repl';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { KeyValue } from '@angular/common';
import { create } from 'domain';

const hourToString = (hour: number): string => {
  return hour <= 9 ? `0${hour.toString()}` : hour.toString();
};

const createHoursArray = (startHour: number, includeEquals: boolean): number[] => {
  const predicate = includeEquals ? x => x >= startHour : x => x > startHour;
  return Array.from(Array(24).keys()).filter(predicate);
};

const createDayHoursInput = (includeEquals: boolean): any[] => {
  let i = 0;
  const inputs = [];
  for (; i <= 23; i++) {
    const input = {
      hour: i,
      expected: createHoursArray(i, includeEquals)
    };

    inputs.push(input);
  }

  return inputs;
};

const assertDayHoursResult = (result: KeyValue<number, string>[], expected: number[]) => {
  expect(result).toBeTruthy();
  expect(result.length).toBe(expected.length);

  const startingHour = expected[0];

  for (let i = startingHour; i <= 23; i++) {
    const actual = result.find(x => x.key === i);

    expect(actual).toBeTruthy();
    expect(actual.value).toBe(hourToString(i));
  }
};

describe('DayHoursService', () => {
  let service: DayHoursService;

  beforeEach(() => {
    service = new DayHoursService();
  });

  describe('getAll', () => {
    it('should return all day hours', () => {
      // given
      const expected = Array.from(Array(24).keys());

      // when
      const result = service.getAll();

      // then
      assertDayHoursResult(result, expected);
    });
  });

  describe('getGreaterOrEqualThan', () => {
    const inputs = createDayHoursInput(true);

    inputs.forEach(input => {
      it(`should return ${input.expected.length} hours for starting hour: ${input.hour}`, () => {
        // when
        const result = service.getGreaterOrEqualThen(input.hour);

        // then
        assertDayHoursResult(result, input.expected);
      });
    });
  });

  describe('getGreaterThan', () => {
    const inputs = createDayHoursInput(false);

    inputs.forEach(input => {
      it(`should return ${input.expected.length} hour for starting hour: ${input.hour}`, () => {
        // when
        const result = service.getGreaterThen(input.hour);

        // then
        assertDayHoursResult(result, input.expected);
      });
    });
  });
});
