import { settingsRoutes } from 'src/app/core/router/constants/routes.constants';
import { TabsHorizontalComponent } from 'src/app/shared/components/ui/tabs-horizontal/tabs-horizontal.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Tabs Horizontal Component', () => {
  let component: TabsHorizontalComponent;

  const { routerFacade } = SpiesBuilder.init().withRouterFacade().build();

  beforeEach(() => {
    component = new TabsHorizontalComponent(routerFacade);
  });

  describe('Get Route Description', () => {
    beforeEach(() => {
      component.routes = settingsRoutes;
    });
    it('should return null if route not found', () => {
      expect(component.getRouteDescription('notExistingRoute')).toBeFalsy();
    });

    it('should return route description', () => {
      const route = settingsRoutes[0];
      expect(component.getRouteDescription(route.url)).toEqual(route.description);
    });
  });
});
