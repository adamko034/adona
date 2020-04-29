import { createAction, props } from '@ngrx/store';
import { Error } from 'src/app/core/error/model/error.model';
import { Event } from 'src/app/modules/calendar/model/event.model';

const types = {
  loadMonthEventsRequest: '[Calendar Page] Load Month Events Request',
  loadMonthEventsSuccess: '[Database API] Load Month Events Success',
  loadMonthEventsFailure: '[Database API] Load Month Events Failure'
};

const loadMonthEventsRequest = createAction(types.loadMonthEventsRequest, props<{ date: Date }>());
const loadMonthEventsSuccess = createAction(types.loadMonthEventsSuccess, props<{ events: Event[]; date: Date }>());
const loadMonthEventsFailure = createAction(types.loadMonthEventsFailure, props<{ error: Error }>());

export const calendarEventsActions = {
  loadMonthEventsFailure,
  loadMonthEventsRequest,
  loadMonthEventsSuccess
};
