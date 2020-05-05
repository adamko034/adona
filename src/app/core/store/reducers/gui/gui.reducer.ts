import { Action, createReducer, on } from '@ngrx/store';
import { SideNavbarOptions } from '../../../gui/model/side-navbar-options.model';
import { guiActions } from '../../actions/gui.actions';

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
  on(guiActions.showLoading, (state) => ({ ...state, loading: true })),
  on(guiActions.hideLoading, (state) => ({ ...state, loading: false }))
);

export function reducer(state: GuiState | undefined, action: Action) {
  return guiReducer(state, action);
}
