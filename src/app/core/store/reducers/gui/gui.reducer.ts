import { Action, createReducer, on } from '@ngrx/store';
import { SideNavbarOptions } from '../../../gui/model/side-navbar-options.model';
import { guiActions } from '../../actions/gui.actions';

export interface GuiState {
  siteNavbarOptions?: SideNavbarOptions;
}

const guiStateInitial: GuiState = {
  siteNavbarOptions: null
};

const guiReducer = createReducer(
  guiStateInitial,
  on(guiActions.initSideNavbar, (state, action) => {
    return { ...state, siteNavbarOptions: action.options };
  }),
  on(guiActions.toggleSideNavbar, state => ({
    ...state,
    siteNavbarOptions: { ...state.siteNavbarOptions, opened: !state.siteNavbarOptions.opened }
  }))
);

export function reducer(state: GuiState | undefined, action: Action) {
  return guiReducer(state, action);
}
