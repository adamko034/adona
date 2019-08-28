import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { Store } from '@ngrx/store';
import { AllEventsRequestedAction } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { AppState } from 'src/app/core/store/reducers';
import { CalendarFacade } from '../../store/calendar.facade';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  view = CalendarView.Month;
  viewDate = new Date();

  constructor(private calendarFacade: CalendarFacade) {}

  ngOnInit() {
    this.calendarFacade.loadAllEvents();
  }

  onViewChanged(newView: CalendarView) {
    this.view = newView;
  }
}
