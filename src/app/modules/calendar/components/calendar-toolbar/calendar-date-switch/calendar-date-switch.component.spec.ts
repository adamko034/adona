import { CalendarView } from 'angular-calendar';
import { TimeComparisonService } from 'src/app/shared/services/time/parts/time-comparison.service';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { CalendarFacade } from '../../../store/calendar.facade';
import { CalendarDateSwitchComponent } from './calendar-date-switch.component';

describe('Calendar Date Switch Component', () => {
  let component: CalendarDateSwitchComponent;
  const facade = jasmine.createSpyObj<CalendarFacade>('calendarFacade', ['changeViewDate']);
  const timeService: any = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('extraction', ['getStartOfWeek', 'getEndOfWeek']),
    Comparison: jasmine.createSpyObj<TimeComparisonService>('comparison', ['areDatesInTheSameMonth'])
  };

  beforeEach(() => {
    component = new CalendarDateSwitchComponent(facade, timeService);

    timeService.Extraction.getStartOfWeek.calls.reset();
    timeService.Extraction.getEndOfWeek.calls.reset();
    timeService.Comparison.areDatesInTheSameMonth.calls.reset();
    facade.changeViewDate.calls.reset();
  });

  describe('On View Date Changed', () => {
    it('should set view date and load events for this date', () => {
      // given
      component.view = { isList: false, calendarView: CalendarView.Month };
      component.viewDate = new Date(2020, 1, 1);
      const newDate = new Date(2020, 2, 1);

      // when
      component.onViewDateChanged(newDate);

      // then
      expect(facade.changeViewDate).toHaveBeenCalledTimes(1);
      expect(facade.changeViewDate).toHaveBeenCalledWith(newDate);
    });

    describe('Adjust Fetch Date For Week View', () => {
      it('should load for previous month', () => {
        // given
        const currentViewDate = new Date(2019, 10, 8);
        component.view = { isList: false, calendarView: CalendarView.Week };
        component.viewDate = currentViewDate;
        const newDate = new Date(2019, 10, 1);
        const fetchDate = new Date(2019, 9, 28);

        const startOfWeek = new Date(2019, 9, 28);
        const endOfWeek = new Date(2019, 10, 3);

        timeService.Extraction.getStartOfWeek.and.returnValue(startOfWeek);
        timeService.Extraction.getEndOfWeek.and.returnValue(endOfWeek);

        timeService.Comparison.areDatesInTheSameMonth
          .withArgs(currentViewDate, startOfWeek)
          .and.returnValue(false)
          .withArgs(currentViewDate, endOfWeek)
          .and.returnValue(true);

        // when
        component.onViewDateChanged(newDate);

        // then
        expect(facade.changeViewDate).toHaveBeenCalledWith(fetchDate);
        expect(facade.changeViewDate).toHaveBeenCalledTimes(1);
      });

      it('should load for next month', () => {
        // given
        const currentViewDate = new Date(2020, 0, 23);
        component.view = { isList: false, calendarView: CalendarView.Week };
        component.viewDate = currentViewDate;
        const newDate = new Date(2020, 0, 30);
        const fetchDate = new Date(2020, 1, 2);

        const startOfWeek = new Date(2020, 0, 27);
        const endOfWeek = new Date(2020, 1, 2);

        timeService.Extraction.getStartOfWeek.and.returnValue(startOfWeek);
        timeService.Extraction.getEndOfWeek.and.returnValue(endOfWeek);

        timeService.Comparison.areDatesInTheSameMonth
          .withArgs(currentViewDate, startOfWeek)
          .and.returnValue(true)
          .withArgs(currentViewDate, endOfWeek)
          .and.returnValue(false);

        // when
        component.onViewDateChanged(newDate);

        // then
        expect(facade.changeViewDate).toHaveBeenCalledWith(fetchDate);
        expect(facade.changeViewDate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
