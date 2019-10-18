import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { EventsTestDataBuilder } from '../utils/tests/event-test-data.builder';
import { fromCalendarEvents, toCalendarEvents } from '../utils/tests/mappers-test-functions';
import {
  MonthEventsRequestedAction,
  NewEventRequestedAction,
  UpdateEventRequestedAction
} from './actions/calendar.actions';
import { CalendarFacade } from './calendar.facade';
import { CalendarState } from './reducers/calendar.reducer';
import { calendarQueries } from './selectors/calendar.selectors';

describe('Calendar Facade', () => {
  let mockStore: MockStore<CalendarState>;
  const mapper: any = {
    CalendarEvent: {
      fromEvents: fromCalendarEvents
    }
  };

  let dispatchSpy;
  let facade: CalendarFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    mockStore = TestBed.get<Store<CalendarState>>(Store);
    facade = new CalendarFacade(mockStore, mapper);

    dispatchSpy = spyOn(mockStore, 'dispatch');
  });

  describe('Load Month Events method', () => {
    it('should dispatch Month Events Requested Action', () => {
      // given
      const date = new Date();

      // when
      facade.loadMonthEvents(date);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new MonthEventsRequestedAction({ date }));
    });
  });

  describe('Update Event method', () => {
    it('should dispatch Update Event Requested Action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.updateEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new UpdateEventRequestedAction({ event }));
    });
  });

  describe('Add Event method', () => {
    it('should dispatch New Event Requested Action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      // when
      facade.addEvent(event);

      // then
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new NewEventRequestedAction({ newEvent: event }));
    });
  });

  fdescribe('Get Months Loaded method', () => {
    it('should return months loaded', () => {
      // given
      const months = ['201901', '201902', '201812'];
      mockStore.overrideSelector(calendarQueries.selectMonthsLoaded, months);

      // when
      const result = facade.getMonthsLoaded();

      // then
      expect(result).toEqual(months);
    });
  });

  fdescribe('Events$ property', () => {
    it('should return events', () => {
      // given
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();
      mockStore.overrideSelector(calendarQueries.selectEvents, events);
      const expected = cold('(b|)', { b: toCalendarEvents(events) });

      // when
      const result = facade.getMonthsLoaded();

      // then
      expect(result).toBeObservable(expected);
    });
  });
});
