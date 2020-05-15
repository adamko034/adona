import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReducer from 'src/app/core/gui/store/reducer/gui.reducer';

const guiStateSelector = createFeatureSelector<fromReducer.GuiState>('gui');

const navBarOptions = createSelector(guiStateSelector, (guiState) => guiState.sideNavbarOptions);
const loading = createSelector(guiStateSelector, (guiState) => guiState.loading);
const toastr = createSelector(guiStateSelector, (guiState) => guiState.toastrData);

export const guiQueries = {
  selectSideNavbarOptions: navBarOptions,
  selectLoading: loading,
  selectTaostrData: toastr
};
