import { Action, createReducer, on } from '@ngrx/store';
import { SideNavbarOptions } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.model';
import { guiActions } from 'src/app/core/gui/store/actions/gui.actions';
import { ToastrData } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.mode';

export interface GuiState {
  sideNavbarOptions?: SideNavbarOptions;
  toastrData?: ToastrData;
  loading: boolean;
}

const guiStateInitial: GuiState = {
  sideNavbarOptions: null,
  toastrData: null,
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
  on(guiActions.hideLoading, (state) => ({ ...state, loading: false })),
  on(guiActions.showToastr, (state, action) => ({ ...state, toastrData: action.data }))
);

export function reducer(state: GuiState | undefined, action: Action) {
  return guiReducer(state, action);
}
