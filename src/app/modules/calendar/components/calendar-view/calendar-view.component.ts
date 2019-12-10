import { Component, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { Event } from '../../model/event.model';
import { CalendarFacade } from '../../store/calendar.facade';
import { CalendarCustomEventTitleFormatter } from '../../utils/calendar-custom-event-title-formatter';
import { CalendarHourFormatter } from '../../utils/calendar-hour-formatter';
import { NewEventDialogComponent } from '../dialogs/new-event-dialog/new-event-dialog.component';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarHourFormatter
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CalendarCustomEventTitleFormatter
    }
  ]
})
export class CalendarViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() viewDate: Date;
  @Input() view: AdonaCalendarView;
  @Input() weekStartsOn: number;
  @Input() events: CalendarEvent[];

  @Output() viewDateChanged = new EventEmitter<Date>();

  private dialogResultSubscription: Subscription;

  public activeDayIsOpen = false;
  public CalendarView = CalendarView;

  constructor(private timeService: TimeService, private editEventDialog: MatDialog, private facade: CalendarFacade) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.activeDayIsOpen = this.eventExistsOnViewDate();
  }

  ngOnDestroy(): void {
    if (this.dialogResultSubscription) {
      this.dialogResultSubscription.unsubscribe();
    }
  }

  onViewDateChanged(newDate: Date) {
    this.viewDateChanged.emit(newDate);
  }

  onNextMonth() {
    const newDate = this.timeService.Manipulation.addMonths(1, this.viewDate);
    this.onViewDateChanged(newDate);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.timeService.Comparison.areInTheSameMonth(this.viewDate, date)) {
      let showActiveDay = true;

      if (
        (this.timeService.Comparison.areDatesTheSame(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        showActiveDay = false;
      }

      this.activeDayIsOpen = showActiveDay;
    }
  }

  public eventClicked(event: CalendarEvent): void {
    const dialogRef = this.editEventDialog.open(NewEventDialogComponent, {
      width: '400px',
      data: { event }
    });

    this.dialogResultSubscription = dialogRef.afterClosed().subscribe((updatedEvent: Event) => {
      if (updatedEvent) {
        this.facade.updateEvent(updatedEvent);
      }
    });
  }

  private eventExistsOnViewDate(): boolean {
    return (
      _.findIndex(this.events, (x: CalendarEvent) =>
        this.timeService.Comparison.isDateBetweenDates(this.viewDate, x.start, x.end)
      ) >= 0
    );
  }
}
