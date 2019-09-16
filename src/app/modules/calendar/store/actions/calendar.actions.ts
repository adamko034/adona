import { Action } from '@ngrx/store';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { NewEventRequest } from '../../model/new-event-request.model';

export enum CalendarActionTypes {
  MonthEventsRequested = '[Calendar Page] Month Events Requested',
  EventsLoaded = '[Calendar API] Events Loaded',
  EventsLoadedError = '[Calendar API] Events Loaded Error',
  NewEventRequested = '[Calendar Page] New Event Requested',
  NewEventAdded = '[Calendar API] New Event Added',
  EventCreationError = '[Calendar Page] Event Creation Error'
}

export class MonthEventsRequestedAction implements Action {
  readonly type = CalendarActionTypes.MonthEventsRequested;

  constructor(public payload: { date: Date }) {}
}

export class EventsLoadedAction implements Action {
  readonly type = CalendarActionTypes.EventsLoaded;

  constructor(public payload: { events: Event[]; yearMonth: string }) {}
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
  | EventsLoadedAction
  | MonthEventsRequestedAction
  | EventsLoadedErrorAction
  | NewEventRequestedAction
  | NewEventAddedAction
  | EventCreationErrorAction;
