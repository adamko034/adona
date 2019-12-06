import { CalendarView } from 'angular-calendar';
import { CalendarToolbarComponent } from './calendar-toolbar.component';

describe('Calendar Toolbar Component', () => {
  let component: CalendarToolbarComponent;

  beforeEach(() => {
    component = new CalendarToolbarComponent();
  });

  it('should emit empty value on new event button clicked', () => {
    // given
    const spy = spyOn(component.newEventClicked, 'emit');

    // when
    component.onNewEventClicked();

    // then
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit new date on view date changed', () => {
    // given
    const newDate = new Date();
    const spy = spyOn(component.viewDateChanged, 'emit');

    // when
    component.onViewDateChanged(newDate);

    // then
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(newDate);
  });

  [CalendarView.Month, CalendarView.Week, CalendarView.Day].forEach((input) => {
    it(`should emit view: ${input.toString()} on view changed`, () => {
      // given
      const spy = spyOn(component.viewChanged, 'emit');

      // when
      component.onViewChanged(input);

      // then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(input);
    });
  });
});
