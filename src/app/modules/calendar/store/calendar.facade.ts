import { Store } from '@ngrx/store';
import { AllEventsRequestedAction } from './actions/calendar.actions';
import { CalendarState } from './reducers/calendar.reducer';

export class CalendarFacade {
  constructor(private store: Store<CalendarState>) {}

  public loadAllEvents(): void {
    this.store.dispatch(new AllEventsRequestedAction());
  }
}
