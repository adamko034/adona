import { EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { Views } from 'src/app/modules/calendar/components/calendar-toolbar/calendar-view-switch/model/calendar-view-switch-views.enum';
import { AdonaCalendarView } from 'src/app/modules/calendar/model/adona-calendar-view.model';
import { CalendarViewSwitchComponent } from './calendar-view-switch.component';

describe('CalendarViewSwitchComponent', () => {
  let component: CalendarViewSwitchComponent;

  beforeEach(() => {
    component = new CalendarViewSwitchComponent();

    component.viewChanged = jasmine.createSpyObj<EventEmitter<AdonaCalendarView>>('ViewChangedEventEmitter', ['emit']);
  });

  it('should set default values', () => {
    // then
    expect(component.view).toBe(Views.Month);
    expect(component.Views).toEqual(Views);
  });

  [
    { newView: Views.Day, expectedViewEmitted: CalendarView.Day, expectedIsList: false },
    { newView: Views.Week, expectedViewEmitted: CalendarView.Week, expectedIsList: false },
    { newView: Views.Month, expectedViewEmitted: CalendarView.Month, expectedIsList: false },
    { newView: Views.List, expectedViewEmitted: CalendarView.Month, expectedIsList: true }
  ].forEach(input => {
    it(`should set view to ${input.newView.toString()} and emit value`, () => {
      // when
      component.onViewChanged(input.newView);

      // then
      expect(component.view).toEqual(input.newView);
      expect(component.viewChanged.emit).toHaveBeenCalledTimes(1);
      expect(component.viewChanged.emit).toHaveBeenCalledWith({
        view: input.expectedViewEmitted,
        isList: input.expectedIsList
      });
    });
  });
});
