import { Action } from '@ngrx/store';
import { Event } from 'src/app/modules/calendar/model/event.model';

export enum CalendarActionTypes {
  AllEventsRequested = '[Calendar View] All Events Requested',
  AllEventsLoaded = '[Calendar API] All Events Loaded'
}

export class AllEventsRequestedAction implements Action {
  readonly type = CalendarActionTypes.AllEventsRequested;
}

export class AllEventsLoadedAction implements Action {
  readonly type = CalendarActionTypes.AllEventsLoaded;

  constructor(public payload: { events: Event[] }) {}
}

export type CalendarActions = AllEventsLoadedAction | AllEventsRequestedAction;
