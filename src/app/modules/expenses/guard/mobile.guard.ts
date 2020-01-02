import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Injectable({ providedIn: 'root' })
export class MobileGuard implements CanActivate {
  constructor(private deviceService: DeviceDetectorService, private navigationService: NavigationService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const mobileUrl = state.url.includes('/expenses/m');
    const params = state.url.substring(state.url.indexOf('/expenses/') + 12);

    if (!mobileUrl && this.deviceService.isMobile()) {
      this.navigationService.toExpensesMobile(params);
      return false;
    }

    if (mobileUrl && !this.deviceService.isMobile()) {
      this.navigationService.toExpenses(params);
      return false;
    }

    return true;
  }
}
