import {
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
      const action = {} as any;
      const expected: CalendarState = new CalendarStateTestDataBuilder().build();

      // when
      const result = calendarReducer(undefined, action);

      // then
      expect(result).toEqual(expected);
    });

    it('should return previous state for unknown action', () => {
      // given
      const action = {} as any;
      const events = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents();
      const previousState = new CalendarStateTestDataBuilder()
        .withEvents(events)
        .withMonthsLoaded(['201901'])
        .build();

      // when
      const result = calendarReducer(previousState, action);

      // expect
      expect(result).toEqual(previousState);
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
      expect(result).toEqual(expectedState);
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
      expect(result).toEqual(expectedState);
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
      expect(result).toEqual(expectedState);
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
      expect(result).toEqual(expectedState);
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
      expect(result).toEqual(expectedState);
    });
  });
});
