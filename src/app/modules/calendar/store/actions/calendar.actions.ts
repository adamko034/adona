import { Action } from '@ngrx/store';
import { Event } from 'src/app/modules/calendar/model/event.model';

export enum CalendarActionTypes {
  AllEventsRequested = '[Calendar View] All Events Requested',
  AllEventsLoaded = '[Calendar API] All Events Loaded',
  EventsLoadedError = '[Calendar API] Events Loaded Error',
  AddEvent = '[Calendar View] Add Event'
}

export class AllEventsRequestedAction implements Action {
  readonly type = CalendarActionTypes.AllEventsRequested;
}

export class AllEventsLoadedAction implements Action {
  readonly type = CalendarActionTypes.AllEventsLoaded;

  constructor(public payload: { events: Event[] }) {}
}

export class EventsLoadedErrorAction implements Action {
  readonly type = CalendarActionTypes.EventsLoadedError;

  constructor(public payload?: { error: string }) {}
}

export class AddEventAction implements Action {
  readonly type = CalendarActionTypes.AddEvent;

  constructor(public payload: { event: Event }) {}
}

export type CalendarActions =
  | AllEventsLoadedAction
  | AllEventsRequestedAction
  | EventsLoadedErrorAction
  | AddEventAction;
