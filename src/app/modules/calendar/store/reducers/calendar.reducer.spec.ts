import {
  calendarReducer,
  CalendarState
} from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { AllEventsLoadedAction } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarStateTestDataBuilder } from 'src/app/modules/calendar/utils/tests/calendar-state-test-data.builder';

describe('Calendar Reducer', () => {
  const calendarStateBuilder = new CalendarStateTestDataBuilder();

  it('should return initial state', () => {
    // given
    const action = {} as any;
    const expected: CalendarState = calendarStateBuilder.fromEvents([]);

    // when
    const result = calendarReducer(undefined, action);

    // then
    expect(result).toEqual(expected);
  });

  it('should return previous state for unknown action', () => {
    // given
    const action = {} as any;
    const events = new EventsTestDataBuilder().addOneWithDefaultData().build();
    const previousState = calendarStateBuilder.fromEvents(events);

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
      .build();

    const previousState = calendarStateBuilder.fromEvents(events.slice(0, 2), true);
    const expectedState = calendarStateBuilder.fromEvents(events, true);

    const action = new AllEventsLoadedAction({ events });

    // when
    const result = calendarReducer(previousState, action);

    // then
    expect(result).toEqual(expectedState);
  });
});
