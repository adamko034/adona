import { MapperService } from './mapper.service';

describe('Mapper Service', () => {
  let mapperService: MapperService;

  beforeEach(() => {
    mapperService = new MapperService();
  });

  it('should contain users mapper class', () => {
    // then
    expect(mapperService.Users).toBeTruthy();
  });
});
