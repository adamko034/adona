import { createAction, props } from '@ngrx/store';
import { SideNavbarOptions } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.model';
import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.mode';

export const guiActionTypes = {
  initSideNavbar: '[Home Page] Init Side Navbar',
  toggleSideNavbar: '[Home Page] Toggle Side Navbar',
  closeSideNavbar: '[Home Page] Close Home Page',

  showLoading: '[Page] Show Loading',
  hideLoading: '[API] Hide Loading',

  showToastr: '[Page] Show Toastr'
};

const initSideNavbar = createAction(guiActionTypes.initSideNavbar, props<{ options: SideNavbarOptions }>());
const toggleSideNavbar = createAction(guiActionTypes.toggleSideNavbar);

const showLoading = createAction(guiActionTypes.showLoading);
const hideLoading = createAction(guiActionTypes.hideLoading);

const showToastr = createAction(guiActionTypes.showToastr, props<{ data: ToastrData }>());

export const guiActions = {
  initSideNavbar,
  toggleSideNavbar,
  showLoading,
  hideLoading,
  showToastr
};
