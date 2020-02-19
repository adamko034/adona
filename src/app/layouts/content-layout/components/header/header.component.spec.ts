import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { HeaderComponent } from './header.component';

describe('Header Component', () => {
  let component: HeaderComponent;
  const { authFacade, deviceDetectorService } = SpiesBuilder.init()
    .withAuthFacade()
    .withDeviceDetectorService()
    .build();

  beforeEach(() => {
    component = new HeaderComponent(authFacade, deviceDetectorService);
  });

  describe('Logout', () => {
    it('should call facade on logout', () => {
      component.logout();

      expect(authFacade.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Is Mobile', () => {
    it('should call Device Detector Service', () => {
      component.isMobile();

      expect(deviceDetectorService.isMobile).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Toggle Side Nav', () => {
    it('should emit value', () => {
      const spy = spyOn(component.toggleSideNav, 'emit');
      component.onToggleSideNav();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
