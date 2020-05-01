import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarState, reducer } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { CalendarStateTestDataBuilder } from 'src/app/modules/calendar/utils/tests/calendar-state-test-data.builder';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';

describe('Calendar Reducer', () => {
  describe('Initial state', () => {
    it('should return initial state', () => {
      const date = new Date();
      const action = {} as any;
      const expected: CalendarState = CalendarStateTestDataBuilder.fromDefaults().build();

      const result = reducer(undefined, action);

      expect({ ...result, viewDate: date }).toEqual({ ...expected, viewDate: date });
      expect(moment(result.viewDate).isSame(expected.viewDate, 'day')).toBeTruthy();
    });

    it('should return previous state for unknown action', () => {
      const date = new Date();
      const action = {} as any;
      const events = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents();
      const previousState = CalendarStateTestDataBuilder.fromDefaults()
        .withEvents(events, events[0].teamId)
        .withMonthsLoaded([DateTestBuilder.now().build()], events[0].teamId)
        .build();

      const result = reducer(previousState, action);
      expect({ ...result, viewDate: date }).toEqual({ ...previousState, viewDate: date });
    });
  });

  describe('On Load Month Events Success', () => {
    it('should return new state with events', () => {
      const dateNow = DateTestBuilder.now().build();
      const dateMonthAgo = DateTestBuilder.now().addMonth(-1).build();

      const events = EventsTestDataBuilder.from()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      const teamId = events[0].teamId;

      const previousState = CalendarStateTestDataBuilder.fromDefaults()
        .withEvents(events.slice(0, 2), teamId)
        .withMonthsLoaded([dateNow], teamId)
        .build();
      const expectedState = CalendarStateTestDataBuilder.fromDefaults()
        .withEvents(events, teamId)
        .withMonthsLoaded([dateNow, dateMonthAgo], teamId)
        .build();

      const result = reducer(
        previousState,
        calendarActions.events.loadMonthEventsSuccess({ events, date: dateMonthAgo, teamId })
      );

      expect(result.teams[teamId]).toBeTruthy();
      expect(result.teams[teamId].entities).toEqual(expectedState.teams[teamId].entities);
      expect(result.teams[teamId].ids).toEqual(expectedState.teams[teamId].ids);
      expect(result.teams[teamId].monthsLoaded).toEqual(expectedState.teams[teamId].monthsLoaded);
    });
  });

  describe('On Add Event Success', () => {
    it('should add event to empty state', () => {
      const event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];
      const teamId = event.teamId;
      const expectedState = CalendarStateTestDataBuilder.fromDefaults().withEvents([event], event.teamId).build();

      const result = reducer(undefined, calendarActions.event.addEventSuccess({ event }));

      expect(result.teams[teamId]).toBeTruthy();
      expect(result.teams[teamId].entities).toEqual(expectedState.teams[teamId].entities);
      expect(result.teams[teamId].ids).toEqual(expectedState.teams[teamId].ids);
      expect(result.teams[teamId].monthsLoaded).toEqual(expectedState.teams[teamId].monthsLoaded);
    });

    it('should add event to previous state', () => {
      const events = EventsTestDataBuilder.from()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      const teamId = events[0].teamId;

      const previousState = CalendarStateTestDataBuilder.fromDefaults().withEvents(events.slice(0, 3), teamId).build();
      const expectedState = CalendarStateTestDataBuilder.fromDefaults().withEvents(events, teamId).build();

      const result = reducer(previousState, calendarActions.event.addEventSuccess({ event: events[3] }));

      expect(result.teams[teamId]).toBeTruthy();
      expect(result.teams[teamId].entities).toEqual(expectedState.teams[teamId].entities);
      expect(result.teams[teamId].ids).toEqual(expectedState.teams[teamId].ids);
      expect(result.teams[teamId].monthsLoaded).toEqual(expectedState.teams[teamId].monthsLoaded);
    });
  });

  describe('On Update Event Success', () => {
    it('should update event', () => {
      const events = EventsTestDataBuilder.from()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      const teamId = events[0].teamId;

      const eventUpdate = {
        id: events[3].id,
        changes: { ...events[3], title: 'this is new updated title' }
      };
      const previousState = CalendarStateTestDataBuilder.fromDefaults().withEvents(events, teamId).build();

      const expectedEvents = [...events];
      expectedEvents[3].title = 'this is new updated title';

      const expectedState = CalendarStateTestDataBuilder.fromDefaults().withEvents(expectedEvents, teamId).build();

      const result = reducer(previousState, calendarActions.event.updateEventSuccess({ eventUpdate }));

      expect(result.teams[teamId]).toBeTruthy();
      expect(result.teams[teamId].entities).toEqual(expectedState.teams[teamId].entities);
      expect(result.teams[teamId].ids).toEqual(expectedState.teams[teamId].ids);
      expect(result.teams[teamId].monthsLoaded).toEqual(expectedState.teams[teamId].monthsLoaded);
    });
  });

  describe('Event Deleted', () => {
    it('should delete event', () => {
      const events = EventsTestDataBuilder.from()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();

      const teamId = events[0].teamId;
      const eventToDelete = events[2];
      const previousState = CalendarStateTestDataBuilder.fromDefaults().withEvents(events, teamId).build();

      const expectedEvents = events.filter((e) => e.id !== eventToDelete.id);
      const expectedState = CalendarStateTestDataBuilder.fromDefaults().withEvents(expectedEvents, teamId).build();

      const result = reducer(previousState, calendarActions.event.deleteEventSuccess({ id: eventToDelete.id, teamId }));

      expect(result.teams[teamId]).toBeTruthy();
      expect(result.teams[teamId].entities).toEqual(expectedState.teams[teamId].entities);
      expect(result.teams[teamId].ids).toEqual(expectedState.teams[teamId].ids);
      expect(result.teams[teamId].monthsLoaded).toEqual(expectedState.teams[teamId].monthsLoaded);
    });
  });

  it('on View Date Change', () => {
    const newDate = new Date(2020, 2, 20);
    const currentState = CalendarStateTestDataBuilder.fromDefaults().build();
    const expectedState = { ...currentState, viewDate: newDate };

    expect(reducer(currentState, calendarActions.ui.viewDateChange({ date: newDate }))).toEqual(expectedState);
  });

  it('on View Change', () => {
    const newView = { isList: false, calendarView: CalendarView.Day };
    const previousState = CalendarStateTestDataBuilder.fromDefaults().build();

    expect(reducer(previousState, calendarActions.ui.viewChange({ view: newView }))).toEqual({
      ...previousState,
      view: newView
    });
  });
});
