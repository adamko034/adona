import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { Event } from 'src/app/modules/calendar/model/event.model';

export enum CalendarActionTypes {
  MonthEventsRequested = '[Calendar Page] Month Events Requested',
  EventsLoaded = '[Calendar API] Events Loaded',
  EventsLoadedError = '[Calendar API] Events Loaded Error',
  NewEventRequested = '[Calendar Page] New Event Requested',
  NewEventAdded = '[Calendar API] New Event Added',
  UpdateEventRequested = '[Calendar Page] Edit Event Requested',
  EventCreationError = '[Calendar API] Event Creation Error',
  EventUpdated = '[Calendar API] Event Updated',
  EventUpdateError = '[Calendar API] Event Updated Error'
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

  constructor(public payload: { error: Error }) {}
}

export class NewEventRequestedAction implements Action {
  readonly type = CalendarActionTypes.NewEventRequested;

  constructor(public payload: { newEvent: Event }) {}
}

export class NewEventAddedAction implements Action {
  readonly type = CalendarActionTypes.NewEventAdded;

  constructor(public payload: { event: Event }) {}
}

export class UpdateEventRequestedAction implements Action {
  readonly type = CalendarActionTypes.UpdateEventRequested;

  constructor(public payload: { event: Event }) {}
}

export class EventUpdatedAction implements Action {
  readonly type = CalendarActionTypes.EventUpdated;

  constructor(public payload: { eventUpdate: Update<Event> }) {}
}

export class EventUpdateErrorAction implements Action {
  readonly type = CalendarActionTypes.EventUpdateError;

  constructor(public payload?: { error: Error }) {}
}

export class EventCreationErrorAction implements Action {
  readonly type = CalendarActionTypes.EventCreationError;

  constructor(public payload?: { error: Error }) {}
}

export type CalendarActions =
  | EventsLoadedAction
  | MonthEventsRequestedAction
  | EventsLoadedErrorAction
  | NewEventRequestedAction
  | NewEventAddedAction
  | UpdateEventRequestedAction
  | EventUpdatedAction
  | EventUpdateErrorAction
  | EventCreationErrorAction;
