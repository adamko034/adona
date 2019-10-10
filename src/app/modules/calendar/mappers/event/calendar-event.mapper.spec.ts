import { CalendarEvent } from 'calendar-utils';
import { Event } from '../../model/event.model';
import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { CalendarEventMapper } from './calendar-event.mapper';

function toCalendarEvent(event: Event): CalendarEvent {
  return {
    id: event.id,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    title: event.title
  };
}

describe('Calendar Event Mapper', () => {
  let mapper: CalendarEventMapper;

  beforeEach(() => {
    mapper = new CalendarEventMapper();
  });

  it('should map from event', () => {
    // given
    const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
    const expected: CalendarEvent = toCalendarEvent(event);

    // when
    const actual = mapper.fromEvent(event);

    // then
    expect(actual).toEqual(expected);
  });

  it('should map from events', () => {
    // given
    const events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .buildEvents();

    const expected = [];
    events.forEach((event: Event) => {
      expected.push(toCalendarEvent(event));
    });

    // when
    const actual = mapper.fromEvents(events);

    // then
    expect(actual).toEqual(expected);
  });
});
