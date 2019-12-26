import { EventEmitter } from '@angular/core';
import { CalendarDateSwitchComponent } from './calendar-date-switch.component';

describe('CalendarDateSwitchComponent', () => {
  let component: CalendarDateSwitchComponent;
  const eventEmitter = jasmine.createSpyObj<EventEmitter<Date>>('EventEmitter', ['emit']);

  beforeEach(() => {
    component = new CalendarDateSwitchComponent();

    component.viewDateChanged = eventEmitter;
  });

  it('should emit values new date', () => {
    // given
    const date = new Date();
    component.viewDate = date;

    // when
    component.onViewDateChanged();

    // then
    expect(component.viewDate).toBe(date);
    expect(component.viewDateChanged.emit).toHaveBeenCalledTimes(1);
    expect(component.viewDateChanged.emit).toHaveBeenCalledWith(date);
  });
});
