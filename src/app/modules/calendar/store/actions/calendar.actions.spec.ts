import {
  AllEventsRequestedAction,
  CalendarActionTypes,
  AllEventsLoadedAction,
  EventsLoadedErrorAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Actions', () => {
  it('should create all events requested action', () => {
    // when
    const action = new AllEventsRequestedAction();

    // then
    expect({ ...action }).toEqual({ type: CalendarActionTypes.AllEventsRequested });
  });

  it('should create all events loaded action', () => {
    // given
    const events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .build();

    // when
    const action = new AllEventsLoadedAction({ events });

    // then
    expect({ ...action }).toEqual({
      type: CalendarActionTypes.AllEventsLoaded,
      payload: { events }
    });
  });

  it('should create events error request acion', () => {
    // when
    const action = new EventsLoadedErrorAction();

    // then
    expect(action.type).toEqual(CalendarActionTypes.EventsLoadedError);
  });
});
