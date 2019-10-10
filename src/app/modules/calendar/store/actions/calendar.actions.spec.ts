import {
  CalendarActionTypes,
  EventsLoadedAction,
  EventsLoadedErrorAction,
  MonthEventsRequestedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Actions', () => {
  it('should create all events requested action', () => {
    // given
    const date = new Date();

    // when
    const action = new MonthEventsRequestedAction({ date });

    // then
    expect({ ...action }).toEqual({ type: CalendarActionTypes.MonthEventsRequested, payload: { date } });
  });

  it('should create all events loaded action', () => {
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

  it('should create events error request acion', () => {
    // when
    const action = new EventsLoadedErrorAction({ error: { errorObj: { code: '500' } } });

    // then
    expect({ ...action }).toEqual({
      type: CalendarActionTypes.EventsLoadedError,
      payload: { error: { errorObj: { code: '500' } } }
    });
  });
});
