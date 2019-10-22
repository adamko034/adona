import { KeyValue } from '@angular/common';
import { HourQuartersService } from './hour-quarters.service';

function assertHourQuarters(result: KeyValue<number, string>[], expected: number[]) {
  expect(result.length).toEqual(expected.length);

  for (let i = expected[0]; i <= expected[expected.length - 1]; i += 15) {
    const row = result.find(x => x.key === i);
    expect(row).toBeTruthy();
    expect(row.value).toBe(i === 0 ? '00' : i.toString());
  }
}

describe('HourQuartersService', () => {
  let service: HourQuartersService;

  beforeEach(() => {
    service = new HourQuartersService();
  });

  describe('Get All', () => {
    it('should return all hour quarters', () => {
      // when
      const result: KeyValue<number, string>[] = service.getAll();

      // then
      assertHourQuarters(result, [0, 15, 30, 45]);
    });
  });

  describe('Get Greater Than', () => {
    [
      { greaterThan: 0, expected: [15, 30, 45] },
      { greaterThan: 15, expected: [30, 45] },
      { greaterThan: 30, expected: [45] },
      { greaterThan: 45, expected: [0, 15, 30, 45] }
    ].forEach(input => {
      it(`should return ${input.expected.join(', ')} for greater than ${input.greaterThan}`, () => {
        // when
        const result = service.getGreaterThan(input.greaterThan);

        // then
        assertHourQuarters(result, input.expected);
      });
    });
  });
});
