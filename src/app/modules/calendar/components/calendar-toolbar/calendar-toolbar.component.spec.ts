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
});
