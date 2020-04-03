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

  it('should create Request Loading action', () => {
    expect({ ...guiActions.requestLoading() }).toEqual({ type: guiActionTypes.requestLoading });
  });

  it('should create Request Success action', () => {
    expect({ ...guiActions.requestSuccess() }).toEqual({ type: guiActionTypes.requestSuccess });
  });

  it('should create Request Failure action', () => {
    expect({ ...guiActions.requestFailure() }).toEqual({ type: guiActionTypes.requestFailure });
  });
});
