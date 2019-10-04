import { EventsLoadedAction } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { calendarReducer, CalendarState } from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { CalendarStateTestDataBuilder } from 'src/app/modules/calendar/utils/tests/calendar-state-test-data.builder';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Reducer', () => {
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
    const events = new EventsTestDataBuilder().addOneWithDefaultData().buildEvent();
    const previousState = new CalendarStateTestDataBuilder()
      .withEvents(events)
      .withMonthsLoaded(['201901'])
      .build();

    // when
    const result = calendarReducer(previousState, action);

    // expect
    expect(result).toEqual(previousState);
  });

  it('should return new state on all events loaded action', () => {
    // given
    const events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .buildEvent();

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
