import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({ providedIn: 'root' })
export class SideNavbarService {
  constructor(private deviceDetector: DeviceDetectorService) {}

  public init(sideNav: MatSidenav) {
    this.deviceDetector.isMobile() ? this.prepareSideNavForMobile(sideNav) : this.prepareSideNavForDesktop(sideNav);
  }

  private prepareSideNavForMobile(sideNav: MatSidenav) {
    sideNav.close();
    sideNav.mode = 'over';
  }

  private prepareSideNavForDesktop(sideNav: MatSidenav) {
    sideNav.open();
    sideNav.mode = 'side';
  }
}
