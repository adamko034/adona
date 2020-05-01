import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';

describe('Calendar Events Actions', () => {
  const teamId = '123';
  it('should create Load Month Events Request action', () => {
    const date = new Date();

    expect(calendarActions.events.loadMonthEventsRequest({ date, teamId })).toEqual({
      type: '[Calendar Page] Load Month Events Request',
      date,
      teamId
    });
  });

  it('should create Load Month Events Success action', () => {
    const date = new Date();
    const events = EventsTestDataBuilder.from()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .buildEvents();

    expect(calendarActions.events.loadMonthEventsSuccess({ events, date, teamId })).toEqual({
      type: '[Database API] Load Month Events Success',
      events,
      date,
      teamId
    });
  });

  it('should create Load Month Events Failure action', () => {
    const error = ErrorTestDataBuilder.from().withDefaultData().build();

    expect(calendarActions.events.loadMonthEventsFailure({ error })).toEqual({
      type: '[Database API] Load Month Events Failure',
      error
    });
  });
});
