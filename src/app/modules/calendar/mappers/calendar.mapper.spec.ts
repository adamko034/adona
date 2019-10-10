import { CalendarMapper } from './calendar.mapper';
import { CalendarEventMapper } from './event/calendar-event.mapper';
import { EventMapper } from './event/event.mapper';

describe('Calendar Mapper', () => {
  it('should contains concrete mappers', () => {
    // given
    const mapper = new CalendarMapper();

    // then
    expect(mapper.CalendarEvent).toBeTruthy();
    expect(mapper.Event).toBeTruthy();

    expect(mapper.CalendarEvent).toEqual(jasmine.any(CalendarEventMapper));
    expect(mapper.Event).toEqual(jasmine.any(EventMapper));
  });
});
