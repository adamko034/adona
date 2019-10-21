import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  EventsLoadedAction,
  EventsLoadedErrorAction,
  MonthEventsRequestedAction,
  NewEventAddedAction,
  NewEventRequestedAction,
  EventCreationErrorAction,
  UpdateEventRequestedAction,
  EventUpdatedAction,
  EventUpdateErrorAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';
import { CalendarEffects } from 'src/app/modules/calendar/store/effects/calendar.effects';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { errors } from 'src/app/shared/constants/errors.constants';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { ErrorTestDataBuilder } from 'src/app/core/utils/tests/error-test-data.builder';

describe('Calendar Effects', () => {
  let actions$: Observable<Action>;
  let effects: CalendarEffects;
  let events: Event[];
  let calendarService: jasmine.SpyObj<CalendarService>;
  let calendarFacade: jasmine.SpyObj<CalendarFacade>;

  let monthsLoaded$;

  const timeService = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('TimeExtractionService', [
      'getYearMonthString'
    ])
  };

  beforeEach(() => {
    calendarService = jasmine.createSpyObj<CalendarService>('CalendarService', [
      'getMonthEvents',
      'addEvent',
      'updateEvent'
    ]);
    calendarFacade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', ['getMonthsLoaded']);

    TestBed.configureTestingModule({
      providers: [
        CalendarEffects,
        { provide: CalendarService, useValue: calendarService },
        { provide: TimeService, useValue: timeService },
        { provide: CalendarFacade, useValue: calendarFacade },
        provideMockActions(() => actions$)
      ]
    });

    monthsLoaded$ = new BehaviorSubject([]);

    calendarService.getMonthEvents.calls.reset();
    calendarService.addEvent.calls.reset();
    calendarService.updateEvent.calls.reset();
    timeService.Extraction.getYearMonthString.calls.reset();

    calendarService.getMonthEvents.and.callFake(() => of(events));
    timeService.Extraction.getYearMonthString.and.returnValue('201901');
    calendarFacade.getMonthsLoaded.and.returnValue(monthsLoaded$.asObservable());

    effects = TestBed.get<CalendarEffects>(CalendarEffects);
    events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .buildEvents();
  });

  describe('Month Events Requested effect', () => {
    it('should load events if not fetched earlier for this month and return Events Loaded action', () => {
      // given
      const action = new MonthEventsRequestedAction({ date: new Date() });
      const completion = new EventsLoadedAction({ events, yearMonth: '201901' });
      actions$ = hot('--a|', { a: action });
      const expected = cold('--b|', { b: completion });

      // when && then
      expect(effects.monthEventsRequested$).toBeObservable(expected);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(1);
      expect(timeService.Extraction.getYearMonthString).toHaveBeenCalledTimes(2);
    });

    it('should not load events for month if they were fetched before', () => {
      // given
      monthsLoaded$.next(['201901']);

      const action = new MonthEventsRequestedAction({ date: new Date() });
      actions$ = hot('--a', { a: action });
      const expected = cold('---');

      // when && then
      expect(effects.monthEventsRequested$).toBeObservable(expected);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(0);
      expect(timeService.Extraction.getYearMonthString).toHaveBeenCalledTimes(1);
    });

    it('should return Events Loaded Error action when api call fail', () => {
      // given
      const errorObj = new Error();

      const action = new MonthEventsRequestedAction({ date: new Date() });
      const errored = new EventsLoadedErrorAction({ error: { errorObj } });

      calendarService.getMonthEvents.and.returnValue(throwError(errorObj));

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: errored });

      // when & then
      expect(effects.monthEventsRequested$).toBeObservable(expected);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(1);
    });
  });

  describe('Events Loaded Error effect', () => {
    it('should map to Error Occured action with custom message', () => {
      // given
      const message = 'this is error';
      const action = new EventsLoadedErrorAction({ error: { message, errorObj: { code: '500' } } });
      const completion = new ErrorOccuredAction({ error: { message, errorObj: { code: '500' } } });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      // when & then
      expect(effects.eventsLoadedError$).toBeObservable(expected);
    });

    it('should map to Error Occured action with default message', () => {
      // given
      const action = new EventsLoadedErrorAction({ error: { errorObj: { code: '404' } } });
      const completion = new ErrorOccuredAction({
        error: { errorObj: { code: '404' }, message: errors.DEFAULT_API_GET_ERROR_MESSAGE }
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      // when & then
      expect(effects.eventsLoadedError$).toBeObservable(expected);
    });
  });

  describe('New Event Requested effect', () => {
    it('should add event and map to New Event Added action', () => {
      // givent
      const eventRequest = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const newEvent = { ...eventRequest, id: 'new id' };
      calendarService.addEvent.and.returnValue(of(newEvent));

      actions$ = hot('-a', { a: new NewEventRequestedAction({ newEvent: eventRequest }) });
      const expected = cold('-b', { b: new NewEventAddedAction({ event: newEvent }) });

      // when & then
      expect(effects.newEventRequested$).toBeObservable(expected);
      expect(calendarService.addEvent).toHaveBeenCalledTimes(1);
      expect(calendarService.addEvent).toHaveBeenCalledWith(eventRequest);
    });

    it('should map to Event Creation Error action', () => {
      // given
      const eventRequest = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const error = new ErrorTestDataBuilder().withDefaultData().build();

      calendarService.addEvent.and.returnValue(throwError(error));

      actions$ = hot('-a', { a: new NewEventRequestedAction({ newEvent: eventRequest }) });
      const expected = cold('-b', {
        b: new EventCreationErrorAction({ error: { errorObj: error } })
      });

      // when & then
      expect(effects.newEventRequested$).toBeObservable(expected);
      expect(calendarService.addEvent).toHaveBeenCalledTimes(1);
      expect(calendarService.addEvent).toHaveBeenCalledWith(eventRequest);
    });
  });

  describe('Event Creation Error effect', () => {
    it('should map to Error Occured Action with default message', () => {
      // given
      const error = new ErrorTestDataBuilder().withErrorObj({ status: 500 }).build();
      const expectedError = { ...error, message: errors.DEFAULT_API_POST_ERROR_MESSAGE };
      actions$ = hot('-a', { a: new EventCreationErrorAction({ error }) });
      const expected = hot('-b', { b: new ErrorOccuredAction({ error: expectedError }) });

      // then
      expect(effects.eventCreationError$).toBeObservable(expected);
    });

    it('should map to Error Occured Action with custom message', () => {
      // given
      const error = new ErrorTestDataBuilder().withDefaultData().build();
      actions$ = hot('-a', { a: new EventCreationErrorAction({ error }) });
      const expected = hot('-b', { b: new ErrorOccuredAction({ error }) });

      // then
      expect(effects.eventCreationError$).toBeObservable(expected);
    });
  });

  describe('Update Event Request effect', () => {
    it('should call service and return Event Updated Action', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const eventUpdate = { id: event.id, changes: event };

      calendarService.updateEvent.and.returnValue(of(event));

      actions$ = hot('-a', { a: new UpdateEventRequestedAction({ event }) });
      const expected = cold('-b', { b: new EventUpdatedAction({ eventUpdate }) });

      // when & then
      expect(effects.updateEventRequested$).toBeObservable(expected);
      expect(calendarService.updateEvent).toHaveBeenCalledTimes(1);
      expect(calendarService.updateEvent).toHaveBeenCalledWith(event);
    });

    it('should return Event Update Error Action when updating fails', () => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];
      const error = new ErrorTestDataBuilder().withDefaultData().build();

      calendarService.updateEvent.and.returnValue(throwError(error.errorObj));

      actions$ = hot('-a', { a: new UpdateEventRequestedAction({ event }) });
      const expected = cold('-b', {
        b: new EventUpdateErrorAction({ error: { errorObj: error.errorObj } })
      });

      // when & then
      expect(effects.updateEventRequested$).toBeObservable(expected);
      expect(calendarService.updateEvent).toHaveBeenCalledTimes(1);
      expect(calendarService.updateEvent).toHaveBeenCalledWith(event);
    });
  });

  describe('Event Update Error effect', () => {
    it('should map to Event Occured Action with custom message', () => {
      // given
      const error = new ErrorTestDataBuilder().withDefaultData().build();
      actions$ = hot('-a', { a: new EventUpdateErrorAction({ error }) });
      const expected = cold('-b', { b: new ErrorOccuredAction({ error }) });

      // when & then
      expect(effects.eventUpdateError$).toBeObservable(expected);
    });

    it('should map to Event Occured Action with default message', () => {
      // given
      const error = new ErrorTestDataBuilder().withErrorObj({ status: 503 }).build();
      const expectedError = { ...error, message: errors.DEFAULT_API_PUT_ERROR_MESSAGE };
      actions$ = hot('-a', { a: new EventUpdateErrorAction({ error }) });
      const expected = cold('-b', { b: new ErrorOccuredAction({ error: expectedError }) });

      // when & then
      expect(effects.eventUpdateError$).toBeObservable(expected);
    });
  });
});
