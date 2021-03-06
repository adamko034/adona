import { TimeCreationService } from 'src/app/shared/services/time/parts/time-creation.service';

describe('Time Creation Service', () => {
  let service: TimeCreationService;

  beforeEach(() => {
    service = new TimeCreationService();
  });

  describe('Get Date Time From', () => {
    it('should create date object', () => {
      // given
      const today = new Date();

      // when
      const result = service.from(today, 12, 15);

      // then
      expect(result instanceof Date).toBeTruthy();
      expect(result.getFullYear()).toBe(today.getFullYear());
      expect(result.getMonth()).toBe(today.getMonth());
      expect(result.getDate()).toBe(today.getDate());
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(15);
    });
  });
});
