import { Subject } from 'rxjs';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

describe('Unsubscriber Service', () => {
  let service: UnsubscriberService;

  beforeEach(() => {
    service = new UnsubscriberService();
  });

  describe('Create', () => {
    it('should create new subject', () => {
      expect(service.create()).toEqual(new Subject<void>());
    });
  });

  describe('Complete', () => {
    it('should complete given Subject', () => {
      const subject = new Subject<void>();
      const nextSpy = spyOn(subject, 'next');
      const completeSpy = spyOn(subject, 'complete');

      service.complete(subject);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledBefore(completeSpy);
    });

    it('should not complete if Subject is null', () => {
      service.complete(null);
    });

    it('should not complete if Subject is undefined', () => {
      service.complete(undefined);
    });
  });
});
