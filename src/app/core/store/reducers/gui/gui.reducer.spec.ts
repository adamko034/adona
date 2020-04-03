import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { SideNavbarOptionsBuilder } from '../../../gui/model/builders/side-navbar-options.builder';
import { SideNavbarOptions } from '../../../gui/model/side-navbar-options.model';
import { guiActions } from '../../actions/gui.actions';
import * as fromReducer from './gui.reducer';

describe('Gui Reducer', () => {
  const initialState: fromReducer.GuiState = { sideNavbarOptions: null, backendState: null };

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

  describe('Api Request joruney', () => {
    it('should change state for: loading, success and failure', () => {
      expect(fromReducer.reducer(initialState, guiActions.requestLoading())).toEqual({
        ...initialState,
        backendState: BackendStateBuilder.loading()
      });
      expect(fromReducer.reducer(initialState, guiActions.requestSuccess())).toEqual({
        ...initialState,
        backendState: BackendStateBuilder.success()
      });
      expect(fromReducer.reducer(initialState, guiActions.requestFailure())).toEqual({
        ...initialState,
        backendState: BackendStateBuilder.failure()
      });
    });
  });
});
