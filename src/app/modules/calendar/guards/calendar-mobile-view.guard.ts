import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AdonaCalendarViewBuilder } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.builder';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Injectable({ providedIn: 'root' })
export class CalendarMobileViewGuard implements CanActivate {
  constructor(private deviceDetectorService: DeviceDetectorService, private navigationService: NavigationService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const adonaCalendarView = AdonaCalendarViewBuilder.fromRoute(state.url).build();

    if (this.isInCorrectMobileView(adonaCalendarView)) {
      this.navigationService.toCalendarListView();
      return false;
    }

    return true;
  }

  private isInCorrectMobileView(adonaCalendarView: AdonaCalendarView): boolean {
    return (
      this.deviceDetectorService.isMobile() &&
      !adonaCalendarView.isList &&
      adonaCalendarView.calendarView !== CalendarView.Day
    );
  }
}
