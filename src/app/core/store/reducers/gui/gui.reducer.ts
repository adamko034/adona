import { Action, createReducer, on } from '@ngrx/store';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';
import { SideNavbarOptions } from '../../../gui/model/side-navbar-options.model';
import { guiActions } from '../../actions/gui.actions';

export interface GuiState {
  sideNavbarOptions?: SideNavbarOptions;
  backendState?: BackendState;
}

const guiStateInitial: GuiState = {
  sideNavbarOptions: null,
  backendState: null
};

const guiReducer = createReducer(
  guiStateInitial,
  on(guiActions.initSideNavbar, (state, action) => {
    return { ...state, sideNavbarOptions: action.options };
  }),
  on(guiActions.toggleSideNavbar, state => ({
    ...state,
    sideNavbarOptions: { ...state.sideNavbarOptions, opened: !state.sideNavbarOptions.opened }
  })),
  on(guiActions.requestLoading, state => ({ ...state, backendState: BackendStateBuilder.loading() })),
  on(guiActions.requestSuccess, state => ({ ...state, backendState: BackendStateBuilder.success() })),
  on(guiActions.requestFailure, state => ({ ...state, backendState: BackendStateBuilder.failure() }))
);

export function reducer(state: GuiState | undefined, action: Action) {
  return guiReducer(state, action);
}
