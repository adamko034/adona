import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { SideNavbarService } from './side-navbar.service';

describe('Side Navbar Service', () => {
  let service: SideNavbarService;

  const { deviceDetectorService } = SpiesBuilder.init()
    .withDeviceDetectorService()
    .build();
  const sideNavbar: any = {
    mode: 'test',
    opened: true,
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close')
  };

  beforeEach(() => {
    service = new SideNavbarService(deviceDetectorService);

    deviceDetectorService.isMobile.calls.reset();
    sideNavbar.open.calls.reset();
    sideNavbar.close.calls.reset();
  });

  describe('Init', () => {
    it('should init for mobile view', () => {
      deviceDetectorService.isMobile.and.returnValue(true);

      service.init(sideNavbar);

      expect(deviceDetectorService.isMobile).toHaveBeenCalledTimes(1);
      expect(sideNavbar.close).toHaveBeenCalledTimes(1);
      expect(sideNavbar.open).toHaveBeenCalledTimes(0);
      expect(sideNavbar.mode).toEqual('over');
    });

    it('should init for non mobile view', () => {
      deviceDetectorService.isMobile.and.returnValue(false);

      service.init(sideNavbar);

      expect(deviceDetectorService.isMobile).toHaveBeenCalledTimes(1);
      expect(sideNavbar.close).toHaveBeenCalledTimes(0);
      expect(sideNavbar.open).toHaveBeenCalledTimes(1);
      expect(sideNavbar.mode).toEqual('side');
    });
  });

  describe('Toggle Side Nav', () => {
    [
      { opened: true, close: 1, open: 0 },
      { opened: false, close: 0, open: 1 }
    ].forEach(input => {
      it(`should ${input.opened ? 'close' : 'open'} side nav`, () => {
        sideNavbar.opened = input.opened;

        service.toggleSideNav(sideNavbar);

        expect(sideNavbar.close).toHaveBeenCalledTimes(input.close);
        expect(sideNavbar.open).toHaveBeenCalledTimes(input.open);
      });
    });
  });

  describe('Close If Mobile', () => {
    [
      { mobile: true, opened: true, close: 1, text: 'should close if mobile and side nav is opened' },
      { mobile: false, opened: true, close: 0, text: 'should not close if not mobile' },
      { mobile: true, opened: false, close: 0, text: 'should not close if mobile but already closed' }
    ].forEach(input => {
      it(input.text, () => {
        sideNavbar.opened = input.opened;
        deviceDetectorService.isMobile.and.returnValue(input.mobile);

        service.closeIfMobile(sideNavbar);

        expect(sideNavbar.close).toHaveBeenCalledTimes(input.close);
      });
    });
  });
});
