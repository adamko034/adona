import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, Subscription } from 'rxjs';
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

  public view = CalendarView.Month;
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;

  constructor(
    private calendarFacade: CalendarFacade,
    public newEventModal: MatDialog,
    private timeService: TimeService
  ) {}

  ngOnInit() {
    this.events$ = this.calendarFacade.events$;
    this.calendarFacade.loadMonthEvents(this.viewDate);
    this.calendarFacade.loadMonthEvents(this.timeService.Extraction.getPreviousMonthOf(this.viewDate));
  }

  ngOnDestroy() {
    this.dialogResultSubscription.unsubscribe();
  }

  public onViewChanged(newView: CalendarView) {
    this.view = newView;
  }

  public onViewDateChanged(newViewDate: Date) {
    this.viewDate = newViewDate;
    this.calendarFacade.loadMonthEvents(this.viewDate);
  }

  public openNewEventModal(): void {
    const dialogRef = this.newEventModal.open(NewEventDialogComponent, {
      width: '400px'
    });

    this.dialogResultSubscription = dialogRef.afterClosed().subscribe((newEvent: Event) => {
      if (newEvent) {
        this.calendarFacade.addEvent(newEvent);
      }
    });
  }
}
