import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { guiActions } from '../store/actions/gui.actions';
import { GuiState } from '../store/reducers/gui/gui.reducer';
import { guiQueries } from '../store/selectors/gui.selectors';
import { SideNavbarOptionsBuilder } from './model/builders/side-navbar-options.builder';
import { SideNavbarOptions } from './model/side-navbar-options.model';

@Injectable({ providedIn: 'root' })
export class GuiFacade {
  constructor(private deviceDetector: DeviceDetectorService, private store: Store<GuiState>) {}

  public selectSideNavbarOptions(): Observable<SideNavbarOptions> {
    return this.store.pipe(select(guiQueries.selectSideNavbarOptions));
  }

  public initSideNavbar(): void {
    const options = this.deviceDetector.isMobile()
      ? SideNavbarOptionsBuilder.forMobile().build()
      : SideNavbarOptionsBuilder.forDesktop().build();

    this.store.dispatch(guiActions.initSideNavbar({ options }));
  }

  public toggleSideNavbar(): void {
    this.store.dispatch(guiActions.toggleSideNavbar());
  }

  public toggleSideNavbarIfMobile(): void {
    if (this.deviceDetector.isMobile()) {
      this.toggleSideNavbar();
    }
  }

  public selectLoading(): Observable<boolean> {
    return this.store.select(guiQueries.selectLoading);
  }

  public showLoading(): void {
    this.store.dispatch(guiActions.showLoading());
  }

  public hideLoading(): void {
    this.store.dispatch(guiActions.hideLoading());
  }
}
