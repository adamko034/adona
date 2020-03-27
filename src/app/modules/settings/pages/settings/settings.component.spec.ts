import { settingsRoutes } from 'src/app/core/router/constants/routes.constants';
import { SettingsComponent } from 'src/app/modules/settings/pages/settings/settings.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Settings Component', () => {
  let component: SettingsComponent;

  const { routerFacade } = SpiesBuilder.init()
    .withRouterFacade()
    .build();

  beforeEach(() => {
    component = new SettingsComponent(routerFacade);
  });

  describe('On Init', () => {
    it('should get settings route', () => {
      routerFacade.selectSettingsRoutes.and.returnValue(settingsRoutes);

      component.ngOnInit();

      expect(routerFacade.selectSettingsRoutes).toHaveBeenCalledTimes(1);
      expect(component.routes.length).toEqual(settingsRoutes.length);
    });
  });
});
