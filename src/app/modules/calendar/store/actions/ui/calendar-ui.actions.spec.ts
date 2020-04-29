import { CalendarView } from 'angular-calendar';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';

describe('Calendar UI Actions', () => {
  it('should create View Change action', () => {
    expect(calendarActions.ui.viewChange({ view: { isList: true, calendarView: CalendarView.Month } })).toEqual({
      type: '[Calendar Page] View Change',
      view: { isList: true, calendarView: CalendarView.Month }
    });
  });

  it('should create View Date Change', () => {
    expect(calendarActions.ui.viewDateChange({ date: new Date(2020, 2, 2) })).toEqual({
      type: '[Calendar Page] View Date Change',
      date: new Date(2020, 2, 2)
    });
  });
});
