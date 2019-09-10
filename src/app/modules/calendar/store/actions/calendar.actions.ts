import { Action } from '@ngrx/store';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { NewEventRequest } from '../../model/new-event-request.model';

export enum CalendarActionTypes {
  AllEventsRequested = '[Calendar Page] All Events Requested',
  AllEventsLoaded = '[Calendar API] All Events Loaded',
  EventsLoadedError = '[Calendar API] Events Loaded Error',
  NewEventRequested = '[Calendar Page] New Event Requested',
  NewEventAdded = '[Calendar API] New Event Added',
  EventCreationError = '[Calendar Page] Event Creation Error'
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

export class NewEventRequestedAction implements Action {
  readonly type = CalendarActionTypes.NewEventRequested;

  constructor(public payload: { newEvent: NewEventRequest }) {}
}

export class NewEventAddedAction implements Action {
  readonly type = CalendarActionTypes.NewEventAdded;

  constructor(public payload: { event: Event }) {}
}

export class EventCreationErrorAction implements Action {
  readonly type = CalendarActionTypes.EventCreationError;

  constructor(public payload?: { error: string }) {}
}

export type CalendarActions =
  | AllEventsLoadedAction
  | AllEventsRequestedAction
  | EventsLoadedErrorAction
  | NewEventRequestedAction
  | NewEventAddedAction
  | EventCreationErrorAction;
