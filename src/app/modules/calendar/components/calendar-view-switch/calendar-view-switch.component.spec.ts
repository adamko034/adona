import { EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarViewSwitchComponent } from './calendar-view-switch.component';

describe('CalendarViewSwitchComponent', () => {
  let component: CalendarViewSwitchComponent;

  beforeEach(() => {
    component = new CalendarViewSwitchComponent();

    component.viewChanged = jasmine.createSpyObj<EventEmitter<CalendarView>>('ViewChangedEventEmitter', ['emit']);
  });

  it('should set default values', () => {
    // then
    expect(component.view).toBe(CalendarView.Month);
    expect(component.CalendarView).toEqual(CalendarView);
  });

  for (const expectedView of Object.keys(CalendarView)) {
    it(`should emit new calendar view: ${expectedView.toString()}`, () => {
      // given
      const expectedCalendarView = CalendarView[expectedView];

      // when
      component.setView(expectedCalendarView);

      // then
      expect(component.view).toBe(expectedCalendarView);
      expect(component.viewChanged.emit).toHaveBeenCalledTimes(1);
      expect(component.viewChanged.emit).toHaveBeenCalledWith(expectedCalendarView);
    });
  }
});
