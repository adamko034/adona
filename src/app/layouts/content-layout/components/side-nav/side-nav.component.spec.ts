import { Subject } from 'rxjs';
import { Route } from '../../../../core/router/model/route.model';
import { SpiesBuilder } from '../../../../utils/testUtils/builders/spies.builder';
import { SideNavComponent } from './side-nav.component';

describe('Side Nav Compoment', () => {
  let component: SideNavComponent;

  const { routerFacade, teamUtilsService, userUtilsService, sharedDialogService, guiFacade } = SpiesBuilder.init()
    .withRouterFacade()
    .withUserUtilsService()
    .withSharedDialogService()
    .withGuiFacade()
    .withTeamUtilsService()
    .build();

  beforeEach(() => {
    component = new SideNavComponent(routerFacade, teamUtilsService, userUtilsService, sharedDialogService, guiFacade);

    userUtilsService.hasMultipleTeams.calls.reset();
  });

  describe('Ng On Init', () => {
    it('should set routes and team members text', () => {
      const routes: Route[] = [
        { icon: 'test', name: 'test', url: 'test url' },
        { icon: 'test 2', name: 'test 2', url: 'test 2 url' }
      ];
      routerFacade.selectAdonaRoutes.and.returnValue(routes);

      component.ngOnInit();

      expect(component.routes).toEqual(routes);
    });
  });

  describe('Ng On Destroy', () => {
    it('should unsubscribe from Change Team subscription', () => {
      (component as any).changeTeamSubscription = new Subject();
      const spy = spyOn((component as any).changeTeamSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Toogle Expand', () => {
    [true, false].forEach(currentValue => {
      it(`should change from ${currentValue.toString()} to ${!currentValue.toString()}`, () => {
        component.isExpanded = currentValue;
        component.toggleExpand();
        expect(component.isExpanded).toEqual(!currentValue);
      });
    });
  });

  describe('On Navigation Link Clicked', () => {
    it('should called facade', () => {
      component.onNavigationLinkClicked();
      expect(guiFacade.toggleSideNavbarIfMobile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Should Show Change Team Action', () => {
    [true, false].forEach(hasMultipleTeams => {
      it(`should return ${hasMultipleTeams.toString()} if user ${
        hasMultipleTeams ? 'has' : 'does not have'
      } multiple teams`, () => {
        userUtilsService.hasMultipleTeams.and.returnValue(hasMultipleTeams);
        const result = component.shouldShowChangeTeamAction();
        expect(result).toEqual(hasMultipleTeams);
      });
    });
  });

  describe('Should Show Quick Actions', () => {
    [true, false].forEach(hasMultipleTeams => {
      it(`should return ${hasMultipleTeams.toString()} if user ${
        hasMultipleTeams ? 'has' : 'does not have'
      } multiple teams`, () => {
        userUtilsService.hasMultipleTeams.and.returnValue(hasMultipleTeams);
        const result = component.shouldShowQuickActions();
        expect(result).toEqual(hasMultipleTeams);
      });
    });
  });
});
