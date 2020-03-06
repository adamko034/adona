import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GuiState } from '../reducers/gui/gui.reducer';

const guiStateSelector = createFeatureSelector<GuiState>('gui');

const navBarOptions = createSelector(guiStateSelector, guiState => guiState.sideNavbarOptions);

export const guiQueries = {
  selectSideNavbarOptions: navBarOptions
};
