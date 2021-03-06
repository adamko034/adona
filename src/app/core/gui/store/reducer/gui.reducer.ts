import { Action, createReducer, on } from '@ngrx/store';
import { SideNavbarOptions } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.model';
import { guiActions } from 'src/app/core/gui/store/actions/gui.actions';
import { userActions } from 'src/app/core/store/actions/user.actions';

export interface GuiState {
  sideNavbarOptions?: SideNavbarOptions;
  loading: boolean;
}

const guiStateInitial: GuiState = {
  sideNavbarOptions: null,
  loading: false
};

const guiReducer = createReducer(
  guiStateInitial,
  on(guiActions.initSideNavbar, (state, action) => {
    return { ...state, sideNavbarOptions: action.options };
  }),
  on(guiActions.toggleSideNavbar, (state) => ({
    ...state,
    sideNavbarOptions: { ...state.sideNavbarOptions, opened: !state.sideNavbarOptions.opened }
  })),
  on(guiActions.showLoading, userActions.handleInvitationRequested, (state) => ({ ...state, loading: true })),
  on(guiActions.hideLoading, userActions.handleInvitationSuccess, (state) => ({ ...state, loading: false }))
);

export function reducer(state: GuiState | undefined, action: Action) {
  return guiReducer(state, action);
}
