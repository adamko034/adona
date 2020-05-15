import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.builder';
import { SideNavbarOptions } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.model';
import { guiActions } from 'src/app/core/gui/store/actions/gui.actions';
import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import * as fromReducer from './gui.reducer';

describe('Gui Reducer', () => {
  const initialState: fromReducer.GuiState = { sideNavbarOptions: null, loading: false };

  describe('Init Side Navbar', () => {
    it('should set Side Navbar Options', () => {
      const options: SideNavbarOptions = SideNavbarOptionsBuilder.forMobile().build();

      const result = fromReducer.reducer(initialState, guiActions.initSideNavbar({ options }));

      expect({ ...result }).toEqual({ ...initialState, sideNavbarOptions: options });
    });
  });

  describe('Toogle Side Navbar', () => {
    it('should change to true', () => {
      const currentOptions = SideNavbarOptionsBuilder.from(false, 'push').build();
      const result = fromReducer.reducer(
        { ...initialState, sideNavbarOptions: currentOptions },
        guiActions.toggleSideNavbar()
      );

      expect({ ...result }).toEqual({ ...initialState, sideNavbarOptions: { opened: true, mode: 'push' } });
    });

    it('should change to false', () => {
      const currentOptions = SideNavbarOptionsBuilder.from(true, 'push').build();
      const result = fromReducer.reducer(
        { ...initialState, sideNavbarOptions: currentOptions },
        guiActions.toggleSideNavbar()
      );

      expect({ ...result }).toEqual({ ...initialState, sideNavbarOptions: { opened: false, mode: 'push' } });
    });
  });

  describe('Show Loading', () => {
    it('should set Loading to true', () => {
      const previousState = { sideNavbarOptions: SideNavbarOptionsBuilder.from(true, 'over').build(), loading: false };

      expect(fromReducer.reducer(previousState, guiActions.showLoading())).toEqual({
        ...previousState,
        loading: true
      });
    });
  });

  describe('Hide Loading', () => {
    it('should set Loading to false', () => {
      const previousState = {
        sideNavbarOptions: SideNavbarOptionsBuilder.from(true, 'over').build(),
        loading: true
      };

      expect(fromReducer.reducer(previousState, guiActions.hideLoading())).toEqual({
        ...previousState,
        loading: false
      });
    });
  });

  describe('Show Toastr', () => {
    it('should set Toastr Data', () => {
      const data = ToastrDataBuilder.from('err', ToastrMode.ERROR).build();
      expect(fromReducer.reducer({ loading: false }, guiActions.showToastr({ data }))).toEqual({
        loading: false,
        toastrData: data
      });
    });
  });
});
