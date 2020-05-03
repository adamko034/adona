import { Views } from 'src/app/modules/calendar/components/calendar-toolbar/calendar-view-switch/model/calendar-view-switch-views.enum';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { CalendarViewSwitchComponent } from './calendar-view-switch.component';

describe('Calendar View Switch Component', () => {
  let component: CalendarViewSwitchComponent;

  const { navigationService } = SpiesBuilder.init().withNavigationService().build();

  beforeEach(() => {
    component = new CalendarViewSwitchComponent(navigationService);
  });

  [
    { newView: Views.Day, spy: navigationService.toCalendarDayView },
    { newView: Views.Week, spy: navigationService.toCalendarWeekView },
    { newView: Views.Month, spy: navigationService.toCalendarMonthView },
    { newView: Views.List, spy: navigationService.toCalendarListView }
  ].forEach((input) => {
    it(`should change view to ${input.newView.toString()}`, () => {
      component.onViewChanged(input.newView);

      expect(input.spy).toHaveBeenCalledTimes(1);
    });
  });
});
