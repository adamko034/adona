import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subscription } from 'rxjs';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { Event } from '../../model/event.model';
import { CalendarFacade } from '../../store/calendar.facade';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private dialogResultSubscription: Subscription;

  public view: AdonaCalendarView = { isList: false, view: CalendarView.Month };
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;

  constructor(
    private calendarFacade: CalendarFacade,
    private timeService: TimeService,
    private deviceService: DeviceDetectorService,
    public newEventModal: MatDialog
  ) {}

  public ngOnInit() {
    this.view.isList = this.deviceService.isMobile();

    this.events$ = this.calendarFacade.events$;
    this.calendarFacade.loadMonthEvents(this.viewDate);
    this.calendarFacade.loadMonthEvents(this.timeService.Extraction.getPreviousMonthOf(this.viewDate));
    this.calendarFacade.loadMonthEvents(this.timeService.Extraction.getNextMonthOf(this.viewDate));
  }

  public ngOnDestroy() {
    if (this.dialogResultSubscription) {
      this.dialogResultSubscription.unsubscribe();
    }
  }

  public onViewChanged(adonaCalendarView: AdonaCalendarView) {
    this.view = adonaCalendarView;
  }

  public onViewDateChanged(newViewDate: Date) {
    const fetchDate = this.adjustFetchDate(newViewDate);
    this.viewDate = newViewDate;

    this.calendarFacade.loadMonthEvents(fetchDate);
  }

  public openNewEventModal() {
    const dialogRef = this.newEventModal.open(NewEventDialogComponent, {
      width: '400px'
    });

    this.dialogResultSubscription = dialogRef.afterClosed().subscribe((newEvent: Event) => {
      if (newEvent) {
        this.calendarFacade.addEvent(newEvent);
      }
    });
  }

  private adjustFetchDate(newViewDate: Date): Date {
    if (this.view.view === CalendarView.Week) {
      const startOfWeek = this.timeService.Extraction.getStartOfWeek(newViewDate);
      const endOfWeek = this.timeService.Extraction.getEndOfWeek(newViewDate);

      if (!this.timeService.Comparison.areDatesInTheSameMonth(this.viewDate, startOfWeek)) {
        return startOfWeek;
      }
      if (!this.timeService.Comparison.areDatesInTheSameMonth(this.viewDate, endOfWeek)) {
        return endOfWeek;
      }
    }

    return newViewDate;
  }
}
