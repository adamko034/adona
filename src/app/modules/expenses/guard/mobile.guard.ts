import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { ExpensesFacade } from '../store/expenses.facade';

@Injectable({ providedIn: 'root' })
export class MobileGuard implements CanActivate {
  constructor(
    private deviceService: DeviceDetectorService,
    private navigationService: NavigationService,
    private expensesFacade: ExpensesFacade
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const mobileUrl = state.url.includes('/expenses/m');
    const params = state.url.substring(state.url.indexOf('/expenses/') + 12);

    if (!mobileUrl && this.deviceService.isMobile()) {
      this.navigationService.toExpensesMobile(params);
      return false;
    }

    if (mobileUrl && !this.deviceService.isMobile()) {
      this.navigationService.toExpensesDesktop(params);
      return false;
    }

    if (mobileUrl && params) {
      return this.expensesFacade.getExpensesLoaded().pipe(
        map((expensesLoaded: boolean) => {
          if (expensesLoaded) {
            return true;
          }

          this.navigationService.toExpensesMobile();
          return false;
        })
      );
    }

    return true;
  }
}
