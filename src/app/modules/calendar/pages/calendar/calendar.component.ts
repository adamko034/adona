import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { Store } from '@ngrx/store';
import { AllEventsRequestedAction } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { AppState } from 'src/app/core/store/reducers';
import { CalendarFacade } from '../../store/calendar.facade';
import { Observable } from 'rxjs';
import { Event } from 'src/app/modules/calendar/model/event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public view = CalendarView.Month;
  public viewDate = new Date();
  public events$: Observable<CalendarEvent[]>;

  constructor(private calendarFacade: CalendarFacade) {}

  ngOnInit() {
    this.events$ = this.calendarFacade.events$;
    this.calendarFacade.loadAllEvents();
  }

  onViewChanged(newView: CalendarView) {
    this.view = newView;
  }
}
