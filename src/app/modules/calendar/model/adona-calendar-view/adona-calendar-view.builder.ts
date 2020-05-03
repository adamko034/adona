import { CalendarView } from 'angular-calendar';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';

export class AdonaCalendarViewBuilder {
  private adonaCalendarView: AdonaCalendarView;

  private constructor(isList: boolean, view: CalendarView) {
    this.adonaCalendarView = { isList, calendarView: view };
  }

  public static fromRoute(route: string): AdonaCalendarViewBuilder {
    if (route === '/calendar' || route.includes('/calendar/month')) {
      return new AdonaCalendarViewBuilder(false, CalendarView.Month);
    }

    if (route.includes('/calendar/week')) {
      return new AdonaCalendarViewBuilder(false, CalendarView.Week);
    }

    if (route.includes('/calendar/day')) {
      return new AdonaCalendarViewBuilder(false, CalendarView.Day);
    }

    if (route.includes('/calendar/list')) {
      return new AdonaCalendarViewBuilder(true, CalendarView.Month);
    }
  }

  public static from(isList: boolean, view: CalendarView): AdonaCalendarViewBuilder {
    return new AdonaCalendarViewBuilder(isList, view);
  }

  public build(): AdonaCalendarView {
    return this.adonaCalendarView;
  }
}
