import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { guiActions } from 'src/app/core/gui/store/actions/gui.actions';
import { GuiState } from 'src/app/core/gui/store/reducer/gui.reducer';
import { guiQueries } from 'src/app/core/gui/store/selectors/gui.selectors';
import { SpiesBuilder } from '../../utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from '../../utils/testUtils/jasmine-custom-matchers';

describe('Gui Facade', () => {
  let facade: GuiFacade;
  let store: MockStore<GuiState>;

  const {
    deviceDetectorService,
    toastrAdonaService
  } = SpiesBuilder.init().withToastrAdonaService().withDeviceDetectorService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    facade = new GuiFacade(deviceDetectorService, store, toastrAdonaService);
  });

  describe('Select Side Navbar Options', () => {
    it('should return observable of Side Navbar Options', () => {
      const options = SideNavbarOptionsBuilder.from(true, 'push').build();

      store.overrideSelector(guiQueries.selectSideNavbarOptions, options);

      expect(facade.selectSideNavbarOptions()).toBeObservable(cold('x', { x: options }));
    });
  });

  describe('Init Side Navbar', () => {
    [true, false].forEach((isMobile) => {
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
    [true, false].forEach((isMobile) => {
      it(`should ${isMobile ? '' : ' not '} dispatch Toogle Side Navbar action`, () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        dispatchSpy.calls.reset();

        deviceDetectorService.isMobile.and.returnValue(isMobile);

        facade.toggleSideNavbarIfMobile();

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, isMobile ? 1 : 0, guiActions.toggleSideNavbar());
      });
    });
  });

  describe('Show Loading', () => {
    it('should dispatch Show Loading action', () => {
      const dispatchSpy = getDispatchSpy(store);
      facade.showLoading();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, guiActions.showLoading());
    });
  });

  describe('Hide Loading', () => {
    it('should dispatch Hide Loading action', () => {
      const spy = getDispatchSpy(store);
      facade.hideLoading();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(spy, 1, guiActions.hideLoading());
    });
  });

  describe('Select Loading', () => {
    it('should return observable of loading value', () => {
      store.overrideSelector(guiQueries.selectLoading, true);
      expect(facade.selectLoading()).toBeObservable(cold('x', { x: true }));
    });
  });

  describe('Show Toastr', () => {
    it('should call service', () => {
      const toastr = ToastrDataBuilder.from('test message', ToastrMode.INFO).build();
      facade.showToastr(toastr);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(toastrAdonaService.show, 1, toastr);
    });
  });

  describe('Hide Toastr', () => {
    it('should Clear All', () => {
      facade.clearToastr();
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(toastrAdonaService.clearAll, 1);
    });
  });
});

function getDispatchSpy(store) {
  return spyOn(store, 'dispatch');
}
