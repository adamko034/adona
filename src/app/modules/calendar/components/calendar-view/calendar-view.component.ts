import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
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
  @Input() view: CalendarView;
  @Input() weekStartsOn: number;
  @Input() events: CalendarEvent[];

  private dialogResultSubscription: Subscription;

  public activeDayIsOpen = true;
  public CalendarView = CalendarView;

  constructor(private timeService: TimeService, private editEventDialog: MatDialog, private facade: CalendarFacade) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.activeDayIsOpen =
      _.findIndex(this.events, (x: CalendarEvent) =>
        this.timeService.Comparison.areDatesTheSame(this.viewDate, x.start)
      ) >= 0;
  }

  ngOnDestroy(): void {
    this.dialogResultSubscription.unsubscribe();
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.timeService.Comparison.areInTheSameMonth(this.viewDate, date)) {
      let showActiveDay = true;

      if (
        (this.timeService.Comparison.areDatesTheSame(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        showActiveDay = false;
      }

      this.activeDayIsOpen = showActiveDay;
      this.viewDate = date;
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
}
