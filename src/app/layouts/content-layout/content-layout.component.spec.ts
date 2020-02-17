import { of, Subject } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { ContentLayoutComponent } from './content-layout.component';

describe('Content Layout Component', () => {
  let component: ContentLayoutComponent;

  const { sideNavbarService, teamFacade, routerFacade } = SpiesBuilder.init()
    .withTeamFacade()
    .withRouterFacade()
    .withSideNavbarService()
    .build();

  beforeEach(() => {
    component = new ContentLayoutComponent(sideNavbarService, teamFacade, routerFacade);
  });

  describe('On Init', () => {
    it('should init the component', () => {
      teamFacade.selectSelectedTeam.and.returnValue(of(null));
      routerFacade.selectCurrentRute.and.returnValue(of(null));

      component.ngOnInit();

      expect(teamFacade.selectSelectedTeam).toHaveBeenCalledTimes(1);
      expect(routerFacade.selectCurrentRute).toHaveBeenCalledTimes(1);
      expect(routerFacade.selectAdonaRoutes).toHaveBeenCalledTimes(1);
      expect(sideNavbarService.init).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe subscriptions', () => {
      (component as any).teamSubscription = new Subject();
      const spy = spyOn((component as any).teamSubscription, 'unsubscribe');

      (component as any).currentRouteSubscription = new Subject();
      const spy2 = spyOn((component as any).currentRouteSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Toggle Side Nav', () => {
    it('should invoke Toggle Side Nav from service', () => {
      component.onToggleSideNav();

      expect(sideNavbarService.toggleSideNav).toHaveBeenCalledTimes(1);
    });
  });

  describe('On Navigation Link Clicked', () => {
    it('should invoke Close If Mobile method from service', () => {
      component.onNavigationLinkClicked();

      expect(sideNavbarService.closeIfMobile).toHaveBeenCalledTimes(1);
    });
  });
});
