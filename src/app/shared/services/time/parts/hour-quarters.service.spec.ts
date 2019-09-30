import { KeyValue } from '@angular/common';
import { HourQuartersService } from './hour-quarters.service';

describe('HourQuartersService', () => {
  let service: HourQuartersService;

  beforeEach(() => {
    service = new HourQuartersService();
  });

  describe('getAll', () => {
    it('should return all hour quarters', () => {
      // when
      const result: KeyValue<number, string>[] = service.getAll();

      // then
      for (let i = 0; i <= 45; i += 15) {
        const row = result.find(x => x.key === i);

        expect(row).toBeTruthy();
        expect(row.value).toBe(i === 0 ? '00' : i.toString());
      }
    });
  });

  describe('getGreaterThan', () => {});
});
