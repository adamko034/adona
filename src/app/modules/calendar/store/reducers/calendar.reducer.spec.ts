import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import {
  CalendarViewChangedAction,
  CalendarViewDateChangedAction,
  EventDeleteSuccessAction,
  EventsLoadedAction,
  EventUpdatedAction,
  NewEventAddedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { calendarReducer, CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { CalendarStateTestDataBuilder } from 'src/app/modules/calendar/utils/tests/calendar-state-test-data.builder';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Reducer', () => {
  describe('Initial state', () => {
    it('should return initial state', () => {
      // given
      const date = new Date();
      const action = {} as any;
      const expected: CalendarState = new CalendarStateTestDataBuilder().build();

      // when
      const result = calendarReducer(undefined, action);

      // then
      expect({ ...result, viewDate: date }).toEqual({ ...expected, viewDate: date });
      expect(moment(result.viewDate).isSame(expected.viewDate, 'day')).toBeTruthy();
    });

    it('should return previous state for unknown action', () => {
      // given
      const date = new Date();
      const action = {} as any;
      const events = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents();
      const previousState = new CalendarStateTestDataBuilder()
        .withEvents(events)
        .withMonthsLoaded(['201901'])
        .build();

      // when
      const result = calendarReducer(previousState, action);

      // expect
      expect({ ...result, viewDate: date }).toEqual({ ...previousState, viewDate: date });
    });
  });

  describe('Events Loaded', () => {
    it('should return new state on all events loaded action', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();

      const previousState = new CalendarStateTestDataBuilder()
        .withEvents(events.slice(0, 2))
        .withMonthsLoaded(['201901'])
        .build();
      const expectedState = new CalendarStateTestDataBuilder()
        .withEvents(events)
        .withMonthsLoaded(['201901', '201902'])
        .build();

      const action = new EventsLoadedAction({ events, yearMonth: '201902' });

      // when
      const result = calendarReducer(previousState, action);

      // then
      expect(result.ids).toEqual(expectedState.ids);
      expect(result.entities).toEqual(expectedState.entities);
      expect(result.monthsLoaded).toEqual(expectedState.monthsLoaded);
    });
  });

  describe('New Event Added', () => {
    it('should add event to empty state', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const action = new NewEventAddedAction({ event });
      const expectedState = new CalendarStateTestDataBuilder().withEvents([event]).build();

      // when
      const result = calendarReducer(undefined, action);

      // then
      expect(result.ids).toEqual(expectedState.ids);
      expect(result.entities).toEqual(expectedState.entities);
      expect(result.monthsLoaded).toEqual(expectedState.monthsLoaded);
    });

    it('should add event to previous state', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      const action = new NewEventAddedAction({ event: events[3] });
      const previousState = new CalendarStateTestDataBuilder().withEvents(events.slice(0, 3)).build();
      const expectedState = new CalendarStateTestDataBuilder().withEvents(events).build();

      // when
      const result = calendarReducer(previousState, action);

      // then
      expect(result.ids).toEqual(expectedState.ids);
      expect(result.entities).toEqual(expectedState.entities);
      expect(result.monthsLoaded).toEqual(expectedState.monthsLoaded);
    });
  });

  describe('Event Updated', () => {
    it('should update event', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      const eventUpdate = {
        id: events[3].id,
        changes: { ...events[3], title: 'this is new updated title' }
      };
      const action = new EventUpdatedAction({ eventUpdate });
      const previousState = new CalendarStateTestDataBuilder().withEvents(events).build();

      const expectedEvents = [...events];
      expectedEvents[3].title = 'this is new updated title';

      const expectedState = new CalendarStateTestDataBuilder().withEvents(expectedEvents).build();

      // when
      const result = calendarReducer(previousState, action);

      // then
      expect(result.ids).toEqual(expectedState.ids);
      expect(result.entities).toEqual(expectedState.entities);
      expect(result.monthsLoaded).toEqual(expectedState.monthsLoaded);
    });
  });

  describe('Event Deleted', () => {
    it('should delete event', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      const eventToDelete = events[2];
      const action = new EventDeleteSuccessAction({ id: eventToDelete.id });
      const previousState = new CalendarStateTestDataBuilder().withEvents(events).build();

      const expectedEvents = events.filter(e => e.id !== eventToDelete.id);
      const expectedState = new CalendarStateTestDataBuilder().withEvents(expectedEvents).build();

      // when
      const result = calendarReducer(previousState, action);

      // then
      expect(result.ids).toEqual(expectedState.ids);
      expect(result.entities).toEqual(expectedState.entities);
      expect(result.monthsLoaded).toEqual(expectedState.monthsLoaded);
    });
  });

  describe('View Date Changed', () => {
    it('should change view date', () => {
      // given
      const newDate = new Date(2020, 2, 12);
      const previousState = new CalendarStateTestDataBuilder().build();

      // when
      const result = calendarReducer(previousState, new CalendarViewDateChangedAction({ newDate }));

      // then
      expect(result.viewDate).toEqual(newDate);
    });
  });

  describe('View Changed', () => {
    it('should change view', () => {
      // given
      const newView = { isList: false, calendarView: CalendarView.Day };
      const previousState = new CalendarStateTestDataBuilder().build();

      // when
      const result = calendarReducer(previousState, new CalendarViewChangedAction({ newView }));

      // then
      expect(result.view).toEqual(newView);
    });
  });
});
