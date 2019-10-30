import { TimeService } from 'src/app/shared/services/time/time.service';
import { Event } from '../model/event.model';
import { CalendarCustomEventTitleFormatter } from './calendar-custom-event-title-formatter';

describe('Calendar Custom Event Title Formatter', () => {
  const timeService = new TimeService();
  let formatter: CalendarCustomEventTitleFormatter;

  beforeEach(() => {
    formatter = new CalendarCustomEventTitleFormatter(timeService);
  });

  describe('Start Date and End Date are the same', () => {
    it('should show all day event', () => {
      // given
      const event: Event = {
        allDay: true,
        id: '1',
        title: 'event title',
        start: new Date(),
        end: new Date()
      };

      const title = 'this is custom title';

      // when
      const result = formatter.month(event, title);

      // then
      expect(result).toEqual(`(all day) ${title}`);
    });

    it('should show start and end times', () => {
      // given
      const event: Event = {
        allDay: false,
        id: '1',
        title: 'event title',
        start: new Date(2019, 10, 1, 10, 30),
        end: new Date(2019, 10, 1, 12, 45)
      };

      const title = 'this is custom title';

      // when
      const result = formatter.month(event, title);

      // then
      expect(result).toEqual(`(10:30 - 12:45) ${title}`);
    });
  });

  describe('Start Date and End Date different', () => {
    it('should display only days if all day is set to true', () => {
      // given
      const event: Event = {
        allDay: true,
        id: '1',
        title: 'event title',
        start: new Date(2019, 10, 1, 10, 30),
        end: new Date(2019, 10, 4, 12, 45)
      };

      const title = 'this is custom title';

      // when
      const result = formatter.month(event, title);

      // then
      expect(result).toEqual(`(01-11-2019 - 04-11-2019) ${title}`);
    });

    it('should display day and time if all day is set to false', () => {
      // given
      const event: Event = {
        allDay: false,
        id: '1',
        title: 'event title',
        start: new Date(2019, 10, 1, 10, 30, 0),
        end: new Date(2019, 10, 4, 12, 45, 0)
      };

      const title = 'this is custom title';

      // when
      const result = formatter.month(event, title);

      // then
      expect(result).toEqual(`(01-11-2019 10:30 - 04-11-2019 12:45) ${title}`);
    });
  });
});
