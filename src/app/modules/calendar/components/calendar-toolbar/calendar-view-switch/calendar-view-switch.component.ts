import { Component } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { Views } from 'src/app/modules/calendar/components/calendar-toolbar/calendar-view-switch/model/calendar-view-switch-views.enum';
import { CalendarFacade } from '../../../store/calendar.facade';

@Component({
  selector: 'app-calendar-view-switch',
  templateUrl: './calendar-view-switch.component.html',
  styleUrls: ['./calendar-view-switch.component.scss']
})
export class CalendarViewSwitchComponent {
  public Views = Views;

  constructor(private calendarFacade: CalendarFacade) {}

  public onViewChanged(view: Views) {
    const newView = {
      isList: view === Views.List,
      calendarView: this.convertEnum(view)
    };

    this.calendarFacade.changeView(newView);
  }

  private convertEnum(componentView: Views): CalendarView {
    switch (componentView) {
      case Views.Day:
        return CalendarView.Day;
      case Views.Week:
        return CalendarView.Week;
      case Views.Month:
        return CalendarView.Month;
      default:
        return CalendarView.Month;
    }
  }
}
