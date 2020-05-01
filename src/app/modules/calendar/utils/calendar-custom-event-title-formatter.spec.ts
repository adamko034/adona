import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { Event } from '../model/event.model';
import { CalendarCustomEventTitleFormatter } from './calendar-custom-event-title-formatter';

describe('Calendar Custom Event Title Formatter', () => {
  const timeService = new TimeService();
  let formatter: CalendarCustomEventTitleFormatter;

  const event: Event = EventsTestDataBuilder.from().addOneWithDefaultData().buildEvents()[0];

  beforeEach(() => {
    formatter = new CalendarCustomEventTitleFormatter(timeService);
  });

  describe('Start Date and End Date are the same', () => {
    it('should show all day event', () => {
      const eventToShow = { ...event, allDay: true };
      const title = 'this is custom title';

      const result = formatter.month(eventToShow, title);

      expect(result).toEqual(`(all day) ${title}`);
    });

    it('should show start and end times', () => {
      const eventToShow = {
        ...event,
        allDay: false,
        start: new Date(2019, 10, 1, 10, 30),
        end: new Date(2019, 10, 1, 12, 45)
      };

      const title = 'this is custom title';

      const result = formatter.month(eventToShow, title);
      expect(result).toEqual(`(10:30 - 12:45) ${title}`);
    });
  });

  describe('Start Date and End Date different', () => {
    it('should display all days events', () => {
      const eventToShow = {
        ...event,
        allDay: true,
        start: new Date(2019, 10, 1, 10, 30),
        end: new Date(2019, 10, 4, 12, 45)
      };
      const title = 'this is custom title';

      const result = formatter.month(eventToShow, title);

      expect(result).toEqual(`(all day) ${title}`);
    });

    it('should display day and time if all day is set to false', () => {
      const eventToShow = {
        ...event,
        allDay: false,
        start: new Date(2019, 10, 1, 10, 30, 0),
        end: new Date(2019, 10, 4, 12, 45, 0)
      };
      const title = 'this is custom title';

      // when
      const result = formatter.month(eventToShow, title);

      // then
      expect(result).toEqual(`(01-11-2019 10:30 - 04-11-2019 12:45) ${title}`);
    });
  });
});
