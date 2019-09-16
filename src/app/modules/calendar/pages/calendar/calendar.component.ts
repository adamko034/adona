import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, Subscription } from 'rxjs';
import { NewEventDialogComponent } from '../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { NewEventRequest } from '../../model/new-event-request.model';
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

  constructor(private calendarFacade: CalendarFacade, public newEventModal: MatDialog) {}

  ngOnInit() {
    this.events$ = this.calendarFacade.events$;
    this.calendarFacade.loadMonthEvents(this.viewDate);
  }

  ngOnDestroy() {
    this.dialogResultSubscription.unsubscribe();
  }

  public onViewChanged(newView: CalendarView) {
    this.view = newView;
  }

  public openNewEventModal(): void {
    const dialogRef = this.newEventModal.open(NewEventDialogComponent, {
      width: '400px'
    });

    this.dialogResultSubscription = dialogRef.afterClosed().subscribe((newEventRequest: NewEventRequest) => {
      if (newEventRequest) {
        this.calendarFacade.addEvent(newEventRequest);
      }
    });
  }
}
