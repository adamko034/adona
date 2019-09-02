import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable } from 'rxjs';
import { NewEventDialogComponent } from '../../components/new-event-dialog/new-event-dialog.component';
import { CalendarFacade } from '../../store/calendar.facade';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public view = CalendarView.Month;
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;

  constructor(private calendarFacade: CalendarFacade, public newEventModal: MatDialog) {}

  ngOnInit() {
    this.events$ = this.calendarFacade.events$;
    this.calendarFacade.loadAllEvents();
  }

  public onViewChanged(newView: CalendarView) {
    this.view = newView;
  }

  public openNewEventModal(): void {
    const dialogRef = this.newEventModal.open(NewEventDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(res => console.log(res));
  }
}
