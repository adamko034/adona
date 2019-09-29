import {
  MonthEventsRequestedAction,
  CalendarActionTypes,
  EventsLoadedAction,
  EventsLoadedErrorAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Actions', () => {
  it('should create all events requested action', () => {
    // when
    const action = new MonthEventsRequestedAction({ date: new Date() });

    // then
    expect({ ...action }).toEqual({ type: CalendarActionTypes.MonthEventsRequested });
  });

  it('should create all events loaded action', () => {
    // given
    const events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .build();

    // when
    const action = new EventsLoadedAction({ events, yearMonth: '201901' });

    // then
    expect({ ...action }).toEqual({
      type: CalendarActionTypes.EventsLoaded,
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
