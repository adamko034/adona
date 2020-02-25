import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { SpiesBuilder } from '../../utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from '../../utils/testUtils/jasmine-custom-matchers';
import { guiActions } from '../store/actions/gui.actions';
import { GuiState } from '../store/reducers/gui/gui.reducer';
import { guiQueries } from '../store/selectors/gui.selectors';
import { GuiFacade } from './gui.facade';
import { SideNavbarOptionsBuilder } from './model/builders/side-navbar-options.builder';

describe('Gui Facade', () => {
  let facade: GuiFacade;
  let store: MockStore<GuiState>;

  const { deviceDetectorService } = SpiesBuilder.init()
    .withDeviceDetectorService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.get<Store<GuiState>>(Store);
    facade = new GuiFacade(deviceDetectorService, store);
  });

  describe('Select Side Navbar Options', () => {
    it('should return observable of Side Navbar Options', () => {
      const options = SideNavbarOptionsBuilder.from(true, 'push').build();

      store.overrideSelector(guiQueries.selectSideNavbarOptions, options);

      expect(facade.selectSideNavbarOptions()).toBeObservable(cold('x', { x: options }));
    });
  });

  describe('Init Side Navbar', () => {
    [true, false].forEach(isMobile => {
      it(`should init side navbar for ${isMobile ? 'mobile' : 'desktop'}`, () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const epxectedOptions = isMobile
          ? SideNavbarOptionsBuilder.forMobile().build()
          : SideNavbarOptionsBuilder.forDesktop().build();
        deviceDetectorService.isMobile.and.returnValue(isMobile);

        facade.initSideNavbar();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          dispatchSpy,
          1,
          guiActions.initSideNavbar({ options: epxectedOptions })
        );
      });
    });
  });

  describe('Toogle Side Navbar', () => {
    it('should dispatch action', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      facade.toggleSideNavbar();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, guiActions.toggleSideNavbar());
    });
  });

  describe('Toogle Side Navbar If Mobile', () => {
    [true, false].forEach(isMobile => {
      it(`should ${isMobile ? '' : ' not '} dispatch Toogle Side Navbar action`, () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        dispatchSpy.calls.reset();

        deviceDetectorService.isMobile.and.returnValue(isMobile);

        facade.toggleSideNavbarIfMobile();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, isMobile ? 1 : 0, guiActions.toggleSideNavbar());
      });
    });
  });
});
