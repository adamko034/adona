import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.builder';
import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
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

  it('should create Show Toastr action', () => {
    const data = ToastrDataBuilder.from('error', ToastrMode.ERROR).withTitle('oops').build();
    expect(guiActions.showToastr({ data })).toEqual({ type: guiActionTypes.showToastr, data });
  });
});
