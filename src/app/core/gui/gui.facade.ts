import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { SideNavbarOptionsBuilder } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.builder';
import { SideNavbarOptions } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.model';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { ToastrAdonaService } from 'src/app/core/gui/services/toastr-adona-service/toastr-adona.service';
import { guiActions } from 'src/app/core/gui/store/actions/gui.actions';
import { GuiState } from 'src/app/core/gui/store/reducer/gui.reducer';
import { guiQueries } from 'src/app/core/gui/store/selectors/gui.selectors';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class GuiFacade {
  constructor(
    private deviceDetector: DeviceDetectorService,
    private store: Store<GuiState>,
    private toastrService: ToastrAdonaService
  ) {}

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
    Logger.logDev('gui facade, show loading');
    this.store.dispatch(guiActions.showLoading());
  }

  public hideLoading(): void {
    Logger.logDev('gui facade, hide loading');
    this.store.dispatch(guiActions.hideLoading());
  }

  public showToastr(data: ToastrData): void {
    this.toastrService.show(data);
  }

  public clearToastr(): void {
    this.toastrService.clearAll();
  }
}
