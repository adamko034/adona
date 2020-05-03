import { Component } from '@angular/core';
import { Views } from 'src/app/modules/calendar/components/calendar-toolbar/calendar-view-switch/model/calendar-view-switch-views.enum';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-calendar-view-switch',
  templateUrl: './calendar-view-switch.component.html',
  styleUrls: ['./calendar-view-switch.component.scss']
})
export class CalendarViewSwitchComponent {
  public Views = Views;

  constructor(private navigationService: NavigationService) {}

  public onViewChanged(view: Views) {
    switch (view) {
      case Views.Month:
        this.navigationService.toCalendarMonthView();
        break;
      case Views.Week:
        this.navigationService.toCalendarWeekView();
        break;
      case Views.Day:
        this.navigationService.toCalendarDayView();
        break;
      case Views.List:
        this.navigationService.toCalendarListView();
        break;
    }
  }
}
