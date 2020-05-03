import { Component, Input } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { CalendarFacade } from '../../../store/calendar.facade';

@Component({
  selector: 'app-calendar-date-switch',
  templateUrl: './calendar-date-switch.component.html',
  styleUrls: ['./calendar-date-switch.component.scss']
})
export class CalendarDateSwitchComponent {
  @Input() view: AdonaCalendarView;
  @Input() viewDate: Date;

  constructor(private calendarFacade: CalendarFacade, private timeService: TimeService) {}

  public onViewDateChanged(newDate: Date) {
    const newViewDate = this.adjustFetchDateForWeekView(newDate);
    this.calendarFacade.changeViewDate(newViewDate);
  }

  private adjustFetchDateForWeekView(newDate: Date): Date {
    if (this.view.calendarView === CalendarView.Week) {
      const startOfWeek = this.timeService.Extraction.getStartOfWeek(newDate);
      const endOfWeek = this.timeService.Extraction.getEndOfWeek(newDate);

      if (!this.timeService.Comparison.areDatesInTheSameMonth(this.viewDate, startOfWeek)) {
        return startOfWeek;
      }

      if (!this.timeService.Comparison.areDatesInTheSameMonth(this.viewDate, endOfWeek)) {
        return endOfWeek;
      }
    }

    return newDate;
  }
}
