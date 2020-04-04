import { SideNavbarOptionsBuilder } from '../../gui/model/builders/side-navbar-options.builder';
import { guiActions, guiActionTypes } from './gui.actions';

describe('Gui Actions', () => {
  it('should create Init Side Navbar action', () => {
    const options = SideNavbarOptionsBuilder.forMobile().build();
    const result = guiActions.initSideNavbar({ options });
    expect({ ...result }).toEqual({ type: guiActionTypes.initSideNavbar, options });
  });

  it('should create Toggle Side Navbar actoin', () => {
    expect({ ...guiActions.toggleSideNavbar() }).toEqual({ type: guiActionTypes.toggleSideNavbar });
  });
});
