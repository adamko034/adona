import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.builder';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { ContentLayoutComponent } from './content-layout.component';

describe('Content Layout Component', () => {
  let component: ContentLayoutComponent;

  const {
    guiFacade,
    teamFacade,
    routerFacade,
    userFacade,
    unsubscriberService
  } = SpiesBuilder.init()
    .withTeamFacade()
    .withUserFacade()
    .withRouterFacade()
    .withGuiFacade()
    .withUnsubscriberService()
    .build();

  beforeEach(() => {
    component = new ContentLayoutComponent(teamFacade, routerFacade, userFacade, guiFacade, unsubscriberService);

    teamFacade.selectSelectedTeam.calls.reset();
    routerFacade.selectCurrentRoute.calls.reset();
    userFacade.selectUser.calls.reset();
    guiFacade.initSideNavbar.calls.reset();
    guiFacade.selectSideNavbarOptions.calls.reset();
    guiFacade.selectLoading.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('should init the component', () => {
      const team = TeamsTestDataBuilder.withDefaultData().build()[0];
      const route = 'test/route';
      const sideNavbarOptions = SideNavbarOptionsBuilder.from(true, 'push').build();
      const user = UserTestBuilder.withDefaultData().build();
      const showLoading = false;

      teamFacade.selectSelectedTeam.and.returnValue(of(team));
      routerFacade.selectCurrentRoute.and.returnValue(of(route));
      guiFacade.selectSideNavbarOptions.and.returnValue(of(sideNavbarOptions));
      userFacade.selectUser.and.returnValue(of(user));
      guiFacade.selectLoading.and.returnValue(of(showLoading));

      component.ngOnInit();

      expect(teamFacade.selectSelectedTeam).toHaveBeenCalledTimes(1);
      expect(routerFacade.selectCurrentRoute).toHaveBeenCalledTimes(1);
      expect(guiFacade.initSideNavbar).toHaveBeenCalledTimes(1);
      expect(guiFacade.selectSideNavbarOptions).toHaveBeenCalledTimes(1);
      expect(guiFacade.selectLoading).toHaveBeenCalledTimes(1);

      expect(component.data$).toBeObservable(
        cold('(x|)', { x: { user, team, showLoading, route, sideNavbarOptions } })
      );
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });
});
