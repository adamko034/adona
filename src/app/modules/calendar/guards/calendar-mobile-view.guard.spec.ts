import { CalendarMobileViewGuard } from 'src/app/modules/calendar/guards/calendar-mobile-view.guard';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Calendar Mobile View Guard', () => {
  let guard: CalendarMobileViewGuard;

  const {
    deviceDetectorService,
    navigationService
  } = SpiesBuilder.init().withDeviceDetectorService().withNavigationService().build();

  beforeEach(() => {
    guard = new CalendarMobileViewGuard(deviceDetectorService, navigationService);

    navigationService.toCalendarListView.calls.reset();
  });

  describe('Correct Route', () => {
    it('should activate on non-mobile devices', () => {
      deviceDetectorService.isMobile.and.returnValue(false);

      expect(guard.canActivate(null, { url: '/calendar' } as any)).toBeTrue();
      expect(navigationService.toCalendarListView).not.toHaveBeenCalled();
    });

    ['/calendar/list', '/calendar/day', '/calendar/list?filter=aaa'].forEach((route) => {
      it(`should activate for route ${route}`, () => {
        deviceDetectorService.isMobile.and.returnValue(true);

        expect(guard.canActivate(null, { url: route } as any)).toBeTrue();
        expect(navigationService.toCalendarListView).not.toHaveBeenCalled();
      });
    });
  });

  describe('Incorrect Route', () => {
    ['/calendar', '/calendar/month', '/calendar/week'].forEach((route) => {
      it(`should not activate route ${route} and navigate to list view`, () => {
        deviceDetectorService.isMobile.and.returnValue(true);

        expect(guard.canActivate(null, { url: route } as any)).toBeFalse();
        expect(navigationService.toCalendarListView).toHaveBeenCalledTimes(1);
      });
    });
  });
});
