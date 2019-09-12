import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CalendarMapper } from 'src/app/modules/calendar/mappers/calendar.mapper';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { NewEventRequest } from '../model/new-event-request.model';

@Injectable()
export class CalendarService {
  private readonly collection: string = '/events';

  constructor(private db: AngularFirestore, private mapper: CalendarMapper) {}

  addEvent(newEventRequest: NewEventRequest): Observable<Event> {
    const newId = this.db.createId();
    const newEvent = this.mapper.Event.fromNewEventRequest(newEventRequest, newId);

    return from(
      this.db
        .collection<Event>(this.collection)
        .add(newEvent)
        .then(() => newEvent)
    );
  }

  getEvents(): Observable<Event[]> {
    return this.db
      .collection(this.collection)
      .valueChanges({ idField: 'id' })
      .pipe(
        take(1),
        map(events => this.mapper.Event.fromFirebaseEvents(events))
      );
  }
}
