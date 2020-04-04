import { createAction, props } from '@ngrx/store';
import { SideNavbarOptions } from '../../gui/model/side-navbar-options.model';

export const guiActionTypes = {
  initSideNavbar: '[Home Page] Init Side Navbar',
  toggleSideNavbar: '[Home Page] Toggle Side Navbar',
  closeSideNavbar: '[Home Page] Close Home Page',

  requestLoading: '[Page] Request Loading',
  requestSuccess: '[Database API] Request Success',
  requestFailure: '[Database API] Request Failure',
  requestFailureWithErrorCode: '[Database API] Request Failure With Error Code'
};

const initSideNavbar = createAction(guiActionTypes.initSideNavbar, props<{ options: SideNavbarOptions }>());
const toggleSideNavbar = createAction(guiActionTypes.toggleSideNavbar);

export const guiActions = {
  initSideNavbar,
  toggleSideNavbar
};
