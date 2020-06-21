import { TilesComponent } from 'src/app/shared/components/ui/tiles/tiles.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Tiles Component', () => {
  let component: TilesComponent;

  const { routerFacade } = SpiesBuilder.init().withRouterFacade().build();

  beforeEach(() => {
    component = new TilesComponent(routerFacade);

    routerFacade.selectCurrentRute.calls.reset();
  });

  describe('On Init', () => {
    it('should not subscribe to current route if Is Navigation equals false', () => {
      component.isNavigation = false;
      component.ngOnInit();
      expect(routerFacade.selectCurrentRute).not.toHaveBeenCalled();
    });

    it('should subscribe to current route if Is Navigation equals true', () => {
      component.isNavigation = true;
      component.ngOnInit();
      expect(routerFacade.selectCurrentRute).toHaveBeenCalledTimes(1);
    });
  });
});
