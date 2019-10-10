import { fakeAsync, flush } from '@angular/core/testing';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { EventMapper } from '../mappers/event/event.mapper';
import { EventsTestDataBuilder } from '../utils/tests/event-test-data.builder';
import { CalendarService } from './calendar.service';

describe('Calendar Service', () => {
  let service: CalendarService;

  const timeService: any = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('TimeExtractionService', [
      'getStartOfMonth',
      'getEndOfMonth'
    ])
  };
  const mapper: any = {
    Event: jasmine.createSpyObj<EventMapper>('EventMapper', ['fromFirebaseEvents'])
  };

  const collectionStub = jasmine.createSpyObj<AngularFirestoreCollection>('Collection', ['add', 'doc', 'valueChanges']);
  const firestore: any = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
  };

  beforeEach(() => {
    service = new CalendarService(firestore, mapper, timeService);
  });

  describe('Add Event', () => {
    it('should add event and returned observable with event with new id', fakeAsync(() => {
      // given
      const newEvent = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      const newId = 'new id';
      const expectedNewEvent = { ...newEvent, id: newId };

      firestore.collection().add.and.returnValue(Promise.resolve({ id: newId }));

      // when
      const actual = service.addEvent(newEvent);
      flush();

      // then
      actual.subscribe(res => {
        expect(res).toEqual(expectedNewEvent);
      });
      expect(firestore.collection).toHaveBeenCalledWith('/events');
      expect(firestore.collection().add).toHaveBeenCalledTimes(1);
      expect(firestore.collection().add).toHaveBeenCalledWith(newEvent);
    }));
  });

  describe('Update Event', () => {
    it('should update event', fakeAsync(() => {
      // given
      const event = new EventsTestDataBuilder().addOneWithDefaultData().buildEvents()[0];

      firestore.collection().doc.and.returnValue({
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve(event))
      });

      // when
      const actual = service.updateEvent(event);
      flush();

      // then
      actual.subscribe(res => {
        expect(res).toEqual(event);
      });
      expect(firestore.collection).toHaveBeenCalledWith('/events');
      expect(firestore.collection().doc).toHaveBeenCalledWith(event.id);
      expect(firestore.collection().doc().update).toHaveBeenCalledWith(event);
    }));
  });

  describe('Get Month Events', () => {
    it('should get events', () => {
      // given
      const date = new Date(2019, 10, 10);
      const startOfMonth = new Date(2019, 10, 1);
      const endOfMonth = new Date(2019, 10, 30);

      timeService.Extraction.getStartOfMonth.and.returnValue(startOfMonth);
      timeService.Extraction.getStartOfMonth.and.returnValue(endOfMonth);

      const firebaseEvents = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildFirebaseEvents();
      const events = new EventsTestDataBuilder()
        .addOneWithDefaultData()
        .addOneWithDefaultData()
        .buildEvents();

      firestore.collection().valueChanges.and.returnValue(of(firebaseEvents));
      mapper.Event.fromFirebaseEvents.and.returnValue(events);
      firestore.collection.calls.reset();

      // when
      const actual = service.getMonthEvents(date);

      // then
      expect(timeService.Extraction.getStartOfMonth).toHaveBeenCalledWith(date);
      expect(timeService.Extraction.getEndOfMonth).toHaveBeenCalledWith(date);
      expect(firestore.collection).toHaveBeenCalledTimes(1);
      expect(firestore.collection().valueChanges).toHaveBeenCalledTimes(1);
      expect(firestore.collection().valueChanges).toHaveBeenCalledWith({ idField: 'id' });

      actual.subscribe(res => {
        expect(mapper.Event.fromFirebaseEvents).toHaveBeenCalledTimes(1);
        expect(mapper.Event.fromFirebaseEvents).toHaveBeenCalledWith(firebaseEvents);
        expect(res).toEqual(events);
      });
    });
  });
});
