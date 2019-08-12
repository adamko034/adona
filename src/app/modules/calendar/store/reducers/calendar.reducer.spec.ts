import { Action } from 'rxjs/internal/scheduler/Action';
import {
  calendarReducer,
  CalendarState
} from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { AllEventsLoadedAction } from 'src/app/modules/calendar/store/actions/calendar.actions';

describe('Calendar Reducer', () => {
  it('should return initial state', () => {
    // given
    const action = {} as any;
    const expected: CalendarState = {
      ids: [],
      entities: {},
      eventsLoaded: false
    };

    // when
    const result = calendarReducer(undefined, action);

    // then
    expect(result).toEqual(expected);
  });

  it('should return previous state for unknown action', () => {
    // given
    const action = {} as any;
    const events = new EventsTestDataBuilder().addOneWithDefaultData().build();
    const previousState = {
      ids: [1],
      entities: {
        1: events[0]
      },
      eventsLoaded: true
    };

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

    const previousState = {
      ids: ['0', '1'],
      entities: {
        0: events[0],
        1: events[1]
      },
      eventsLoaded: true
    };

    const expectedState = {
      ids: ['0', '1', '2', '3'],
      entities: {
        0: events[0],
        1: events[1],
        2: events[2],
        3: events[3]
      },
      eventsLoaded: true
    };

    const action = new AllEventsLoadedAction({ events });

    // when
    const result = calendarReducer(previousState, action);

    // then
    expect(result).toEqual(expectedState);
  });
});
