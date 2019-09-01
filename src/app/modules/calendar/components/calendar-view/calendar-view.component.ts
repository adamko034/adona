import { Component, Input, OnInit } from '@angular/core';
import { CalendarDateFormatter, CalendarView, CalendarEvent } from 'angular-calendar';
import { CalendarHourFormatter } from '../../utils/calendar-hour-formatter';
import { MatDialog } from '@angular/material';
import { NewEventDialogComponent } from '../new-event-dialog/new-event-dialog.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarHourFormatter
    }
  ]
})
export class CalendarViewComponent implements OnInit {
  @Input() viewDate: Date;
  @Input() view: CalendarView;
  @Input() weekStartsOn: number;
  @Input() events: Observable<CalendarEvent[]>;

  activeDayIsOpen = false;
  CalendarView = CalendarView;

  constructor(public newEventModal: MatDialog) {}

  ngOnInit() {}

  public openNewEventModal(): void {
    const dialogRef = this.newEventModal.open(NewEventDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().pipe(map(result => console.log(result)));
  }
}
