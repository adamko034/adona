import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CalendarMapper } from 'src/app/modules/calendar/mappers/calendar.mapper';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { NewEventRequest } from '../model/new-event-request.model';

@Injectable()
export class CalendarService {
  private readonly collectionName: string = '/events';

  constructor(private db: AngularFirestore, private mapper: CalendarMapper, private timeService: TimeService) {}

  public addEvent(newEventRequest: NewEventRequest): Observable<Event> {
    const newId = this.db.createId();
    const newEvent = this.mapper.Event.fromNewEventRequest(newEventRequest, newId);

    return from(
      this.db
        .collection<Event>(this.collectionName)
        .add(newEvent)
        .then(() => newEvent)
    );
  }

  public getMonthEvents(date: Date): Observable<Event[]> {
    const startOfMonth = this.timeService.Extraction.getStartOfMonth(date);
    const endOfMonth = this.timeService.Extraction.getEndOfMonth(date);

    const collection = this.db.collection<Event>(this.collectionName, doc =>
      doc.where('start', '>=', startOfMonth).where('start', '<=', endOfMonth)
    );

    return this.pushEventsFromCollection(collection);
  }

  private pushEventsFromCollection(collection: AngularFirestoreCollection<Event>): Observable<Event[]> {
    return collection.valueChanges({ idField: 'id' }).pipe(
      take(1),
      map(firebaseEvents => this.mapper.Event.fromFirebaseEvents(firebaseEvents)),
      map(events => _.sortBy(events, ['start', ['end']]))
    );
  }
}
