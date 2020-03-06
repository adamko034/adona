import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { GuiFacade } from '../../../../core/gui/gui.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private authFacade: AuthFacade,
    private deviceDetector: DeviceDetectorService,
    private guiFacade: GuiFacade
  ) {}

  public ngOnInit() {}

  public logout() {
    this.authFacade.logout();
  }

  public isMobile() {
    return this.deviceDetector.isMobile();
  }

  public onToggleSideNav() {
    this.guiFacade.toggleSideNavbar();
  }
}
