import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthFacade } from 'src/app/core/auth/auth.facade';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { User } from 'src/app/core/user/model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: User;

  constructor(
    private authFacade: AuthFacade,
    private deviceDetector: DeviceDetectorService,
    private guiFacade: GuiFacade
  ) {}

  public ngOnInit(): void {}

  public logout(): void {
    this.authFacade.logout();
  }

  public isMobile(): boolean {
    return this.deviceDetector.isMobile();
  }

  public onToggleSideNav(): void {
    this.guiFacade.toggleSideNavbar();
  }
}
