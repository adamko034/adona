import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthFacade } from '../../../../core/auth/auth.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter<void>();

  constructor(private authFacade: AuthFacade, private deviceDetector: DeviceDetectorService) {}

  public ngOnInit() {}

  public logout() {
    this.authFacade.logout();
  }

  public isMobile() {
    return this.deviceDetector.isMobile();
  }

  public onToggleSideNav() {
    this.toggleSideNav.emit();
  }
}
