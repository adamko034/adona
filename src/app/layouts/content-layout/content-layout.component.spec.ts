import { of } from 'rxjs';
import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/builders/side-navbar-options.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
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
    teamFacade.loadSelectedTeam.calls.reset();
    routerFacade.selectCurrentRute.calls.reset();
    userFacade.selectUser.calls.reset();
    guiFacade.initSideNavbar.calls.reset();
    guiFacade.selectSideNavbarOptions.calls.reset();
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('should init the component', () => {
      teamFacade.selectSelectedTeam.and.returnValue(of(null));
      routerFacade.selectCurrentRute.and.returnValue(of(null));
      guiFacade.selectSideNavbarOptions.and.returnValue(of(null));
      userFacade.selectUser.and.returnValue(of(null));

      component.ngOnInit();

      expect(teamFacade.selectSelectedTeam).toHaveBeenCalledTimes(1);
      expect(routerFacade.selectCurrentRute).toHaveBeenCalledTimes(1);
      expect(guiFacade.initSideNavbar).toHaveBeenCalledTimes(1);
      expect(guiFacade.selectSideNavbarOptions).toHaveBeenCalledTimes(1);
      expect(teamFacade.loadSelectedTeam).toHaveBeenCalledTimes(1);
    });

    [true, false].forEach((isMobile) => {
      it(`should init side navbar for ${isMobile ? 'mobile' : 'desktop'}`, () => {
        teamFacade.selectSelectedTeam.and.returnValue(of(null));
        routerFacade.selectCurrentRute.and.returnValue(of(null));
        userFacade.selectUser.and.returnValue(of(null));

        const navbarOptions = isMobile
          ? SideNavbarOptionsBuilder.forMobile().build()
          : SideNavbarOptionsBuilder.forDesktop().build();
        guiFacade.selectSideNavbarOptions.and.returnValue(of(navbarOptions));

        (component.sideNav as any) = {
          mode: 'push',
          open: jasmine.createSpy('open'),
          close: jasmine.createSpy('close')
        };

        component.ngOnInit();

        expect(component.sideNav.mode).toEqual(navbarOptions.mode);
        expect(component.sideNav.open).toHaveBeenCalledTimes(isMobile ? 0 : 1);
        expect(component.sideNav.close).toHaveBeenCalledTimes(isMobile ? 1 : 0);
      });
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });
});
