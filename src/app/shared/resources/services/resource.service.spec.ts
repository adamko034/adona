import { ResourceService } from 'src/app/shared/resources/services/resource.service';

describe('Resource Helper Service', () => {
  let service: ResourceService;

  beforeEach(() => {
    service = new ResourceService();
  });

  describe('Format', () => {
    it('should create for 1 param', () => {
      expect(service.format('test {1}', 'first')).toEqual('test first');
    });

    it('should create for 2 params', () => {
      expect(service.format('test {1} and {2}', 'first', 'second')).toEqual('test first and second');
    });

    it('should create for 3 params', () => {
      expect(service.format('{1}{2}{3}', 'one', 'two', 'three')).toEqual('onetwothree');
    });
  });
});
