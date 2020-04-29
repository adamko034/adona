import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { Event } from 'src/app/modules/calendar/model/event.model';

const types = {
  addEventRequest: '[New Event Dialog] Add Event Request',
  addEventSuccess: '[Database API] Add Event Success',
  addEventFailure: '[Database API] Add Event Failure',

  updateEventRequest: '[Update Event Dialog] Update Event Request',
  updateEventSuccess: '[Database API] Update Event Success',
  updateEventFailure: '[Database API] Update Event Failure',

  deleteEventRequest: '[Update Event Dialog] Delete Event Request',
  deleteEventSuccess: '[Database API] Delete Event Success',
  deleteEventFailure: '[Database API] Delete Event Failure'
};

const addEventRequest = createAction(types.addEventRequest, props<{ event: Event }>());
const addEventSuccess = createAction(types.addEventSuccess, props<{ event: Event }>());
const addEventFailure = createAction(types.addEventFailure, props<{ error: Error }>());

const updateEventRequest = createAction(types.updateEventRequest, props<{ event: Event }>());
const updateEventSuccess = createAction(types.updateEventSuccess, props<{ eventUpdate: Update<Event> }>());
const updateEventFailure = createAction(types.updateEventFailure, props<{ error: Error }>());

const deleteEventRequest = createAction(types.deleteEventRequest, props<{ id: string }>());
const deleteEventSuccess = createAction(types.deleteEventSuccess, props<{ id: string }>());
const deleteEventFailure = createAction(types.deleteEventFailure, props<{ error: Error }>());

export const calendarEventActions = {
  addEventFailure,
  addEventRequest,
  addEventSuccess,
  updateEventFailure,
  updateEventRequest,
  updateEventSuccess,
  deleteEventRequest,
  deleteEventSuccess,
  deleteEventFailure
};
