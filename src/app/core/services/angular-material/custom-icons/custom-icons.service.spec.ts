import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomIconsService } from './custom-icons.service';

describe('Custom Icons Service', () => {
  const matIconRegistryMock = jasmine.createSpyObj<MatIconRegistry>('matIconRegistry', ['addSvgIcon']);
  const domSanitizerMock = jasmine.createSpyObj<DomSanitizer>('domSanitizer', ['bypassSecurityTrustResourceUrl']);

  let service: CustomIconsService;

  beforeEach(() => {
    service = new CustomIconsService(matIconRegistryMock, domSanitizerMock);

    domSanitizerMock.bypassSecurityTrustResourceUrl.and.returnValue({ test: 'test' });
  });

  it('should register custom calendar icons', () => {
    // when
    service.init();

    // then
    expect(domSanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(4);
    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledTimes(4);

    expect(domSanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      jasmine.stringMatching('assets/icons/calendar/calendar-month.svg')
    );
    expect(domSanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      jasmine.stringMatching('assets/icons/calendar/calendar-week.svg')
    );
    expect(domSanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      jasmine.stringMatching('assets/icons/calendar/calendar-day.svg')
    );
    expect(domSanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      jasmine.stringMatching('assets/icons/calendar/calendar-list.svg')
    );

    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledWith('calendar-month', jasmine.any(Object));
    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledWith('calendar-week', jasmine.any(Object));
    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledWith('calendar-day', jasmine.any(Object));
    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledWith('calendar-list', jasmine.any(Object));
  });
});
