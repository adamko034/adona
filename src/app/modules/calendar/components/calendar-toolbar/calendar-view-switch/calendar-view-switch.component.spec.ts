import { CalendarView } from 'angular-calendar';
import { Views } from 'src/app/modules/calendar/components/calendar-toolbar/calendar-view-switch/model/calendar-view-switch-views.enum';
import { CalendarFacade } from '../../../store/calendar.facade';
import { CalendarViewSwitchComponent } from './calendar-view-switch.component';

describe('Calendar View Switch Component', () => {
  let component: CalendarViewSwitchComponent;

  const facade = jasmine.createSpyObj<CalendarFacade>('calendarFacade', ['changeView']);

  beforeEach(() => {
    component = new CalendarViewSwitchComponent(facade);

    facade.changeView.calls.reset();
  });

  [
    { newView: Views.Day, expectedViewEmitted: CalendarView.Day, expectedIsList: false },
    { newView: Views.Week, expectedViewEmitted: CalendarView.Week, expectedIsList: false },
    { newView: Views.Month, expectedViewEmitted: CalendarView.Month, expectedIsList: false },
    { newView: Views.List, expectedViewEmitted: CalendarView.Month, expectedIsList: true }
  ].forEach(input => {
    it(`should change view to ${input.newView.toString()}`, () => {
      // when
      component.onViewChanged(input.newView);

      // then
      expect(facade.changeView).toHaveBeenCalledTimes(1);
      expect(facade.changeView).toHaveBeenCalledWith({
        calendarView: input.expectedViewEmitted,
        isList: input.expectedIsList
      });
    });
  });
});
