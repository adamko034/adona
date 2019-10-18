import { EventsTestDataBuilder } from '../../utils/tests/event-test-data.builder';
import { fromCalendarEvent, fromFirebaseEvent } from '../../utils/tests/mappers-test-functions';
import { EventMapper } from './event.mapper';

describe('Event Mapper', () => {
  let mapper: EventMapper;

  beforeEach(() => {
    mapper = new EventMapper();
  });

  it('should map from calendar event', () => {
    // given
    const calendarEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildCalendarEvents()[0];
    const expected = fromCalendarEvent(calendarEvent);

    // when
    const actual = mapper.fromCalendarEvent(calendarEvent);

    // then
    expect(actual).toEqual(expected);
  });

  it('should map from firebase event', () => {
    // given
    const firebaseEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildFirebaseEvents()[0];
    const expected = fromFirebaseEvent(firebaseEvent);

    // when
    const actual = mapper.fromFirebaseEvent(firebaseEvent);

    // then
    expect(actual).toEqual(expected);
  });

  it('should map from firebase events', () => {
    // given
    const firebaseEvents = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .buildFirebaseEvents();
    const expected = [];
    firebaseEvents.forEach((firebaseEvent: any) => {
      expected.push(fromFirebaseEvent(firebaseEvent));
    });

    // when
    const actual = mapper.fromFirebaseEvents(firebaseEvents);

    // then
    expect(actual).toEqual(expected);
  });
});
