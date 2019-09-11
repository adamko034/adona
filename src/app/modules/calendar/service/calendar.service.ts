import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { Observable, of, from } from 'rxjs';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { NewEventRequest } from '../model/new-event-request.model';
import { CalendarMapper } from 'src/app/modules/calendar/mappers/calendar.mapper';
import { map } from 'rxjs/operators';

@Injectable()
export class CalendarService {
  private readonly collection: string = '/events';

  constructor(private db: AngularFirestore, private mapper: CalendarMapper) {}

  addEvent(newEventRequest: NewEventRequest): Observable<Event> {
    const newId = this.db.createId();
    const newEvent = this.mapper.Event.fromNewEventRequest(newEventRequest, newId);

    console.log('add event');
    return from(
      this.db
        .collection<Event>(this.collection)
        .add(newEvent)
        .then(() => newEvent)
    );
  }

  getEvents(): Observable<Event[]> {
    console.log('get events');
    return this.db
      .collection(this.collection)
      .valueChanges({ idField: 'id' })
      .pipe(map(events => this.mapper.Event.fromFirebaseEvents(events)));
  }
}
