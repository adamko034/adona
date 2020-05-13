import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.builder';
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

  it('should create Show Loading action', () => {
    expect(guiActions.showLoading()).toEqual({ type: guiActionTypes.showLoading });
  });

  it('should create Hide Loading action', () => {
    expect(guiActions.hideLoading()).toEqual({ type: guiActionTypes.hideLoading });
  });
});
