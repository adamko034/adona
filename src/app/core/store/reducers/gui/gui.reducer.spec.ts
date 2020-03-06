import { SideNavbarOptionsBuilder } from '../../../gui/model/builders/side-navbar-options.builder';
import { SideNavbarOptions } from '../../../gui/model/side-navbar-options.model';
import { guiActions } from '../../actions/gui.actions';
import * as fromReducer from './gui.reducer';

describe('Gui Reducer', () => {
  const initialState: fromReducer.GuiState = { sideNavbarOptions: null };

  describe('Init Side Navbar', () => {
    it('should set Side Navbar Options', () => {
      const options: SideNavbarOptions = SideNavbarOptionsBuilder.forMobile().build();

      const result = fromReducer.reducer(initialState, guiActions.initSideNavbar({ options }));

      expect({ ...result }).toEqual({ sideNavbarOptions: options });
    });
  });

  describe('Toogle Side Navbar', () => {
    it('should change to true', () => {
      const currentOptions = SideNavbarOptionsBuilder.from(false, 'push').build();
      const result = fromReducer.reducer({ sideNavbarOptions: currentOptions }, guiActions.toggleSideNavbar());

      expect({ ...result }).toEqual({ sideNavbarOptions: { opened: true, mode: 'push' } });
    });

    it('should change to false', () => {
      const currentOptions = SideNavbarOptionsBuilder.from(true, 'push').build();
      const result = fromReducer.reducer({ sideNavbarOptions: currentOptions }, guiActions.toggleSideNavbar());

      expect({ ...result }).toEqual({ sideNavbarOptions: { opened: false, mode: 'push' } });
    });
  });
});
