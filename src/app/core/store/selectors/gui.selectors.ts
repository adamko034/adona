import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from '../reducers/gui/gui.reducer';

const guiStateSelector = createFeatureSelector<fromReducer.GuiState>('gui');

const navBarOptions = createSelector(guiStateSelector, (guiState) => guiState.sideNavbarOptions);
const loading = createSelector(guiStateSelector, (guiState) => guiState.loading);

export const guiQueries = {
  selectSideNavbarOptions: navBarOptions,
  selectLoading: loading
};
