import { CalendarView } from 'angular-calendar';
import { AdonaCalendarViewBuilder } from 'src/app/modules/calendar/model/adona-calendar-view/adona-calendar-view.builder';

describe('Adona Calendar View Builder', () => {
  describe('From Route', () => {
    [
      { route: '/calendar', expected: { isList: false, calendarView: CalendarView.Month } },
      { route: '/calendar/month', expected: { isList: false, calendarView: CalendarView.Month } },
      { route: '/calendar/list', expected: { isList: true, calendarView: CalendarView.Month } },
      { route: '/calendar/day', expected: { isList: false, calendarView: CalendarView.Day } },
      { route: '/calendar/week', expected: { isList: false, calendarView: CalendarView.Week } }
    ].forEach((input) => {
      it(`should create from ${input.route}`, () => {
        expect(AdonaCalendarViewBuilder.fromRoute(input.route).build()).toEqual(input.expected);
      });
    });
  });

  describe('From', () => {
    it('should create Week View', () => {
      expect(AdonaCalendarViewBuilder.from(false, CalendarView.Week).build()).toEqual({
        isList: false,
        calendarView: CalendarView.Week
      });
    });

    it('should create List View', () => {
      expect(AdonaCalendarViewBuilder.from(true, CalendarView.Day).build()).toEqual({
        isList: true,
        calendarView: CalendarView.Day
      });
    });
  });
});
