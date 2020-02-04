import { Update } from '@ngrx/entity';
import { CalendarView } from 'angular-calendar';
import { ErrorTestDataBuilder } from 'src/app/core/utils/tests/error-test-data.builder';
import {
  CalendarActionTypes,
  CalendarViewChangedAction,
  CalendarViewDateChangedAction,
  EventCreationErrorAction,
  EventDeleteErrorAction,
  EventDeleteRequestedAction,
  EventDeleteSuccessAction,
  EventsLoadedAction,
  EventsLoadedErrorAction,
  EventUpdatedAction,
  EventUpdateErrorAction,
  MonthEventsRequestedAction,
  NewEventAddedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { Event } from '../../model/event.model';

describe('Calendar Actions', () => {
  const error = ErrorTestDataBuilder.from()
    .withDefaultData()
    .build();

  describe('Load Month Events', () => {
    it('should create month events requested action', () => {
      // given
      const date = new Date();

      // when
      const action = new MonthEventsRequestedAction({ date });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.MonthEventsRequested, payload: { date } });
    });

    it('should create events loaded action', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();

      // when
      const action = new EventsLoadedAction({ events, yearMonth: '201901' });

      // then
      expect({ ...action }).toEqual({
        type: CalendarActionTypes.EventsLoaded,
        payload: { events, yearMonth: '201901' }
      });
    });

    it('should create events loaded error acion', () => {
      // when
      const action = new EventsLoadedErrorAction({ error });

      // then
      expect({ ...action }).toEqual({
        type: CalendarActionTypes.EventsLoadedError,
        payload: { error }
      });
    });
  });

  describe('Create New Event', () => {
    it('should create new event requested action', () => {
      // given
      const newEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      const action = new NewEventRequestedAction({ newEvent });

      // then
      expect({ ...action }).toEqual({
        type: CalendarActionTypes.NewEventRequested,
        payload: { newEvent }
      });
    });

    it('should create new event added action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      const action = new NewEventAddedAction({ event });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.NewEventAdded, payload: { event } });
    });

    it('should create event creation error action', () => {
      // when
      const action = new EventCreationErrorAction({ error });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.EventCreationError, payload: { error } });
    });
  });

  describe('Event Update actions', () => {
    it('should create event update requested action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      const action = new UpdateEventRequestedAction({ event });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.UpdateEventRequested, payload: { event } });
    });

    it('should create event updated action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const eventUpdate: Update<Event> = {
        changes: event,
        id: event.id
      };

      // when
      const action = new EventUpdatedAction({ eventUpdate });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.EventUpdated, payload: { eventUpdate } });
    });

    it('should create event update error action', () => {
      // when
      const action = new EventUpdateErrorAction({ error });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.EventUpdateError, payload: { error } });
    });
  });

  describe('Event Delete actions', () => {
    it('should create event delete requested action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      const action = new EventDeleteRequestedAction({ id: event.id });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.EventDeleteRequested, payload: { id: event.id } });
    });

    it('should create event delete success action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      const action = new EventDeleteSuccessAction({ id: event.id });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.EventDeleteSuccess, payload: { id: event.id } });
    });

    it('should create event delete error action', () => {
      // when
      const action = new EventDeleteErrorAction({ error });

      // then
      expect({ ...action }).toEqual({ type: CalendarActionTypes.EventDeleteError, payload: { error } });
    });
  });

  describe('View Changed action', () => {
    it('should create', () => {
      // when
      const action = new CalendarViewChangedAction({ newView: { isList: true, calendarView: CalendarView.Month } });

      // then
      expect({ ...action }).toEqual({
        type: CalendarActionTypes.ViewChanged,
        payload: { newView: { isList: true, calendarView: CalendarView.Month } }
      });
    });
  });

  describe('View  Date Changed action', () => {
    it('should create', () => {
      // when
      const action = new CalendarViewDateChangedAction({ newDate: new Date(2020, 2, 2) });

      // then
      expect({ ...action }).toEqual({
        type: CalendarActionTypes.ViewDateChanged,
        payload: { newDate: new Date(2020, 2, 2) }
      });
    });
  });
});
